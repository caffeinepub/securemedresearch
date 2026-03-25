import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Access Control Setup
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type StudyStatus = { #draft; #active; #complete };
  type RequestStatus = { #pending; #approved; #rejected };
  type JobStatus = { #pending; #training; #complete };

  public type UserRole = AccessControl.UserRole;
  public type StudyId = Nat;
  public type HospitalId = Nat;
  public type RequestId = Nat;
  public type FederatedJobId = Nat;
  public type ModelResultId = Nat;
  public type RoundNumber = Nat;
  public type PatientId = Principal;
  public type ConsentId = Nat;

  public type Study = {
    id : StudyId;
    title : Text;
    description : Text;
    researcherId : Principal;
    status : StudyStatus;
  };

  public type Hospital = {
    id : HospitalId;
    name : Text;
    specialization : Text;
    adminId : Principal;
  };

  public type ResearchRequest = {
    id : RequestId;
    studyId : StudyId;
    hospitalId : HospitalId;
    status : RequestStatus;
  };

  public type PatientConsent = {
    id : ConsentId;
    requestId : RequestId;
    patientId : PatientId;
    approved : Bool;
  };

  public type FederatedJob = {
    id : FederatedJobId;
    studyId : StudyId;
    status : JobStatus;
    roundNumber : RoundNumber;
    progressPct : Nat;
    participatingNodes : [HospitalId];
  };

  public type ModelResult = {
    id : ModelResultId;
    studyId : StudyId;
    accuracy : Nat;
    roundsCompleted : RoundNumber;
    participatingHospitals : [HospitalId];
  };

  public type UserProfile = {
    name : Text;
    role : Text; // "researcher", "hospital", or "patient"
  };

  // Persistent Storage
  let studies = Map.empty<StudyId, Study>();
  let hospitals = Map.empty<HospitalId, Hospital>();
  let researchRequests = Map.empty<RequestId, ResearchRequest>();
  let patientConsents = Map.empty<ConsentId, PatientConsent>();
  let federatedJobs = Map.empty<FederatedJobId, FederatedJob>();
  let modelResults = Map.empty<ModelResultId, ModelResult>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextStudyId : Nat = 0;
  var nextHospitalId : Nat = 0;
  var nextRequestId : Nat = 0;
  var nextConsentId : Nat = 0;
  var nextJobId : Nat = 0;
  var nextModelResultId : Nat = 0;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Study Management (CRUD)
  public shared ({ caller }) func createStudy(title : Text, description : Text) : async StudyId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create studies");
    };
    let studyId = nextStudyId;
    nextStudyId += 1;

    let study : Study = {
      id = studyId;
      title;
      description;
      researcherId = caller;
      status = #draft;
    };
    studies.add(studyId, study);
    studyId;
  };

  public query ({ caller }) func getStudy(studyId : StudyId) : async ?Study {
    studies.get(studyId);
  };

  public query ({ caller }) func getAllStudies() : async [Study] {
    studies.values().toArray();
  };

  public shared ({ caller }) func updateStudy(studyId : StudyId, title : Text, description : Text, status : StudyStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update studies");
    };
    switch (studies.get(studyId)) {
      case (null) { Runtime.trap("Study does not exist") };
      case (?study) {
        if (study.researcherId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the researcher or admin can update this study");
        };
        let updatedStudy = {
          id = study.id;
          title;
          description;
          researcherId = study.researcherId;
          status;
        };
        studies.add(studyId, updatedStudy);
      };
    };
  };

  public shared ({ caller }) func deleteStudy(studyId : StudyId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete studies");
    };
    switch (studies.get(studyId)) {
      case (null) { Runtime.trap("Study does not exist") };
      case (?study) {
        if (study.researcherId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the researcher or admin can delete this study");
        };
        studies.remove(studyId);
      };
    };
  };

  // Hospital Management (CRUD)
  public shared ({ caller }) func registerHospital(name : Text, specialization : Text) : async HospitalId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register hospitals");
    };
    let hospitalId = nextHospitalId;
    nextHospitalId += 1;

    let hospital : Hospital = {
      id = hospitalId;
      name;
      specialization;
      adminId = caller;
    };
    hospitals.add(hospitalId, hospital);
    hospitalId;
  };

  public query ({ caller }) func getHospital(hospitalId : HospitalId) : async ?Hospital {
    hospitals.get(hospitalId);
  };

  public query ({ caller }) func getAllHospitals() : async [Hospital] {
    hospitals.values().toArray();
  };

  public shared ({ caller }) func updateHospital(hospitalId : HospitalId, name : Text, specialization : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update hospitals");
    };
    switch (hospitals.get(hospitalId)) {
      case (null) { Runtime.trap("Hospital does not exist") };
      case (?hospital) {
        if (hospital.adminId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the hospital admin or system admin can update this hospital");
        };
        let updatedHospital = {
          id = hospital.id;
          name;
          specialization;
          adminId = hospital.adminId;
        };
        hospitals.add(hospitalId, updatedHospital);
      };
    };
  };

  public shared ({ caller }) func deleteHospital(hospitalId : HospitalId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete hospitals");
    };
    switch (hospitals.get(hospitalId)) {
      case (null) { Runtime.trap("Hospital does not exist") };
      case (?hospital) {
        if (hospital.adminId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the hospital admin or system admin can delete this hospital");
        };
        hospitals.remove(hospitalId);
      };
    };
  };

  // Research Request Management (CRUD)
  public shared ({ caller }) func createResearchRequest(studyId : StudyId, hospitalId : HospitalId) : async RequestId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create research requests");
    };
    switch (studies.get(studyId)) {
      case (null) { Runtime.trap("Study does not exist") };
      case (?study) {
        if (study.researcherId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the researcher or admin can create requests for this study");
        };
      };
    };
    if (not hospitals.containsKey(hospitalId)) {
      Runtime.trap("Hospital does not exist");
    };

    let requestId = nextRequestId;
    nextRequestId += 1;

    let request : ResearchRequest = {
      id = requestId;
      studyId;
      hospitalId;
      status = #pending;
    };
    researchRequests.add(requestId, request);
    requestId;
  };

  public query ({ caller }) func getResearchRequest(requestId : RequestId) : async ?ResearchRequest {
    researchRequests.get(requestId);
  };

  public query ({ caller }) func getAllResearchRequests() : async [ResearchRequest] {
    researchRequests.values().toArray();
  };

  public shared ({ caller }) func updateResearchRequest(requestId : RequestId, status : RequestStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update research requests");
    };
    switch (researchRequests.get(requestId)) {
      case (null) { Runtime.trap("Research request does not exist") };
      case (?request) {
        switch (hospitals.get(request.hospitalId)) {
          case (null) { Runtime.trap("Hospital does not exist") };
          case (?hospital) {
            if (hospital.adminId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Only the hospital admin or system admin can update this request");
            };
          };
        };
        let updatedRequest = {
          id = request.id;
          studyId = request.studyId;
          hospitalId = request.hospitalId;
          status;
        };
        researchRequests.add(requestId, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func deleteResearchRequest(requestId : RequestId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete research requests");
    };
    switch (researchRequests.get(requestId)) {
      case (null) { Runtime.trap("Research request does not exist") };
      case (?request) {
        switch (studies.get(request.studyId)) {
          case (null) { Runtime.trap("Study does not exist") };
          case (?study) {
            if (study.researcherId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Only the researcher or admin can delete this request");
            };
          };
        };
        researchRequests.remove(requestId);
      };
    };
  };

  // Patient Consent Management (CRUD)
  public shared ({ caller }) func submitConsent(requestId : RequestId) : async ConsentId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit consents");
    };
    if (not researchRequests.containsKey(requestId)) {
      Runtime.trap("Research request does not exist");
    };

    let consentId = nextConsentId;
    nextConsentId += 1;

    let consent : PatientConsent = {
      id = consentId;
      requestId;
      patientId = caller;
      approved = false;
    };
    patientConsents.add(consentId, consent);
    consentId;
  };

  public query ({ caller }) func getPatientConsent(consentId : ConsentId) : async ?PatientConsent {
    switch (patientConsents.get(consentId)) {
      case (null) { null };
      case (?consent) {
        if (consent.patientId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own consent");
        };
        ?consent;
      };
    };
  };

  public query ({ caller }) func getAllPatientConsents() : async [PatientConsent] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all consents");
    };
    patientConsents.values().toArray();
  };

  public shared ({ caller }) func approveConsent(consentId : ConsentId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can approve consents");
    };
    switch (patientConsents.get(consentId)) {
      case (null) { Runtime.trap("Consent does not exist") };
      case (?consent) {
        if (consent.patientId != caller) {
          Runtime.trap("Unauthorized: Only the patient can approve their own consent");
        };
        let updatedConsent = {
          id = consent.id;
          requestId = consent.requestId;
          patientId = consent.patientId;
          approved = true;
        };
        patientConsents.add(consentId, updatedConsent);
      };
    };
  };

  public shared ({ caller }) func deletePatientConsent(consentId : ConsentId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete consents");
    };
    switch (patientConsents.get(consentId)) {
      case (null) { Runtime.trap("Consent does not exist") };
      case (?consent) {
        if (consent.patientId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the patient or admin can delete this consent");
        };
        patientConsents.remove(consentId);
      };
    };
  };

  // Federated Job Management (CRUD)
  public shared ({ caller }) func createFederatedJob(
    studyId : StudyId,
    participatingNodes : [HospitalId]
  ) : async FederatedJobId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create federated jobs");
    };
    switch (studies.get(studyId)) {
      case (null) { Runtime.trap("Study does not exist") };
      case (?study) {
        if (study.researcherId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the researcher or admin can create jobs for this study");
        };
      };
    };

    let jobId = nextJobId;
    nextJobId += 1;

    let job : FederatedJob = {
      id = jobId;
      studyId;
      status = #pending;
      roundNumber = 0;
      progressPct = 0;
      participatingNodes;
    };
    federatedJobs.add(jobId, job);
    jobId;
  };

  public query ({ caller }) func getFederatedJob(jobId : FederatedJobId) : async ?FederatedJob {
    federatedJobs.get(jobId);
  };

  public query ({ caller }) func getAllFederatedJobs() : async [FederatedJob] {
    federatedJobs.values().toArray();
  };

  public shared ({ caller }) func updateFederatedJob(
    jobId : FederatedJobId,
    status : JobStatus,
    roundNumber : RoundNumber,
    progressPct : Nat
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update federated jobs");
    };
    switch (federatedJobs.get(jobId)) {
      case (null) { Runtime.trap("Federated job does not exist") };
      case (?job) {
        switch (studies.get(job.studyId)) {
          case (null) { Runtime.trap("Study does not exist") };
          case (?study) {
            if (study.researcherId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Only the researcher or admin can update this job");
            };
          };
        };
        let updatedJob = {
          id = job.id;
          studyId = job.studyId;
          status;
          roundNumber;
          progressPct;
          participatingNodes = job.participatingNodes;
        };
        federatedJobs.add(jobId, updatedJob);
      };
    };
  };

  public shared ({ caller }) func deleteFederatedJob(jobId : FederatedJobId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete federated jobs");
    };
    switch (federatedJobs.get(jobId)) {
      case (null) { Runtime.trap("Federated job does not exist") };
      case (?job) {
        switch (studies.get(job.studyId)) {
          case (null) { Runtime.trap("Study does not exist") };
          case (?study) {
            if (study.researcherId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Only the researcher or admin can delete this job");
            };
          };
        };
        federatedJobs.remove(jobId);
      };
    };
  };

  // Model Result Management (CRUD)
  public shared ({ caller }) func createModelResult(
    studyId : StudyId,
    accuracy : Nat,
    roundsCompleted : RoundNumber,
    participatingHospitals : [HospitalId]
  ) : async ModelResultId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create model results");
    };
    switch (studies.get(studyId)) {
      case (null) { Runtime.trap("Study does not exist") };
      case (?study) {
        if (study.researcherId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the researcher or admin can create results for this study");
        };
      };
    };

    let resultId = nextModelResultId;
    nextModelResultId += 1;

    let result : ModelResult = {
      id = resultId;
      studyId;
      accuracy;
      roundsCompleted;
      participatingHospitals;
    };
    modelResults.add(resultId, result);
    resultId;
  };

  public query ({ caller }) func getModelResult(resultId : ModelResultId) : async ?ModelResult {
    modelResults.get(resultId);
  };

  public query ({ caller }) func getAllModelResults() : async [ModelResult] {
    modelResults.values().toArray();
  };

  public shared ({ caller }) func updateModelResult(
    resultId : ModelResultId,
    accuracy : Nat,
    roundsCompleted : RoundNumber
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update model results");
    };
    switch (modelResults.get(resultId)) {
      case (null) { Runtime.trap("Model result does not exist") };
      case (?result) {
        switch (studies.get(result.studyId)) {
          case (null) { Runtime.trap("Study does not exist") };
          case (?study) {
            if (study.researcherId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Only the researcher or admin can update this result");
            };
          };
        };
        let updatedResult = {
          id = result.id;
          studyId = result.studyId;
          accuracy;
          roundsCompleted;
          participatingHospitals = result.participatingHospitals;
        };
        modelResults.add(resultId, updatedResult);
      };
    };
  };

  public shared ({ caller }) func deleteModelResult(resultId : ModelResultId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete model results");
    };
    switch (modelResults.get(resultId)) {
      case (null) { Runtime.trap("Model result does not exist") };
      case (?result) {
        switch (studies.get(result.studyId)) {
          case (null) { Runtime.trap("Study does not exist") };
          case (?study) {
            if (study.researcherId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Only the researcher or admin can delete this result");
            };
          };
        };
        modelResults.remove(resultId);
      };
    };
  };

  // Dashboard Queries (Role-specific)
  public query ({ caller }) func getResearcherDashboard() : async {
    studies : [Study];
    requests : [ResearchRequest];
    jobs : [FederatedJob];
    models : [ModelResult];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access dashboards");
    };

    let researcherStudies = studies.values().toArray().filter(
      func(study) { study.researcherId == caller }
    );

    let studyIds = researcherStudies.map(func(study) { study.id });

    let researcherRequests = researchRequests.values().toArray().filter(
      func(request) {
        studyIds.find<StudyId>(func(id) { id == request.studyId }) != null
      }
    );

    let researcherJobs = federatedJobs.values().toArray().filter(
      func(job) {
        studyIds.find<StudyId>(func(id) { id == job.studyId }) != null
      }
    );

    let researcherModels = modelResults.values().toArray().filter(
      func(model) {
        studyIds.find<StudyId>(func(id) { id == model.studyId }) != null
      }
    );

    {
      studies = researcherStudies;
      requests = researcherRequests;
      jobs = researcherJobs;
      models = researcherModels;
    };
  };

  public query ({ caller }) func getHospitalDashboard() : async {
    hospital : ?Hospital;
    requests : [ResearchRequest];
    jobs : [FederatedJob];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access dashboards");
    };

    let hospitalOpt = hospitals.values().toArray().find(
      func(h) { h.adminId == caller }
    );

    switch (hospitalOpt) {
      case (null) {
        {
          hospital = null;
          requests = [];
          jobs = [];
        };
      };
      case (?hospital) {
        let hospitalRequests = researchRequests.values().toArray().filter(
          func(request) { request.hospitalId == hospital.id }
        );

        let hospitalJobs = federatedJobs.values().toArray().filter(
          func(job) {
            job.participatingNodes.find<HospitalId>(func(id) { id == hospital.id }) != null
          }
        );

        {
          hospital = ?hospital;
          requests = hospitalRequests;
          jobs = hospitalJobs;
        };
      };
    };
  };

  public query ({ caller }) func getPatientDashboard() : async {
    patientConsents : [PatientConsent];
    associatedRequests : [ResearchRequest];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access dashboards");
    };

    let patientConsentsList = patientConsents.values().toArray().filter(
      func(consent) { consent.patientId == caller }
    );

    let requestIds = patientConsentsList.map(
      func(consent) { consent.requestId }
    );

    let associatedRequests = researchRequests.values().toArray().filter(
      func(req) {
        requestIds.find<RequestId>(func(id) { id == req.id }) != null
      }
    );

    {
      patientConsents = patientConsentsList;
      associatedRequests;
    };
  };
};
