var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var DBname = "COLLEGE-DB";
var RelationName = "PROJECT-TABLE";
var connToken = "90931538|-31949330547846519|90959917";

$("#projectId").focus();

function getempIdJsonObj() {
    var projectId = $("#projectId").val();
    var jsonStr = {
        no: projectId
    };
    return JSON.stringify(jsonStr);
}

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#projectName").val(record.name);
    $("#assignedTo").val(record.class);
    $("#assignmentDate").val(record.assignmentDate);
    $("#deadline").val(record.deadline);
}

function resetForm() {
    $("#projectId").val("");
    $("#projectName").val("");
    $("#assignedTo").val("");
    $("#assignmentDate").val("");
    $("#deadline").val("");
    $("#projectId").prop("disabled", false);
    $('#projectName').prop('disabled', true);
    $('#assignmentDate').prop('disabled', true);
    $('#deadline').prop('disabled', true);
    $('#assignedTo').prop('disabled', true);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#projectId").focus();
}

function validateData() {
    var projectId, projectName, assignedTo, assignmentDate, deadline;
    projectId = $("#projectId").val();
    projectName = $("#projectName").val();
    assignedTo = $("#assignedTo").val();
    assignmentDate = $("#assignmentDate").val();
    deadline = $("#deadline").val();

    if (projectId === "") {
        alert("Project ID is missing");
        $("#projectId").focus();
        return "";
    }
    if (projectName === "") {
        alert("Project Name is missing");
        $("#projectName").focus();
        return "";
    }
    if (assignedTo === "") {
        alert("Assigned To is missing");
        $("#assignedTo").focus();
        return "";
    }
    if (assignmentDate === "") {
        alert("Assignment Date is missing");
        $("#assignmentDate").focus();
        return "";
    }
    if (deadline === "") {
        alert("Deadline is missing");
        $("#deadline").focus();
        return "";
    }

    var jsonStrObj = {
        no: projectId,
        name: projectName,
        class: assignedTo,
        assignmentDate: assignmentDate,
        deadline: deadline,
    };
    return JSON.stringify(jsonStrObj);

}

function getData() {
    var empIdJsonObj = getempIdJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, DBname, RelationName, empIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resultObj.status === 400) {
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#projectName').prop('disabled', false);
        $('#assignmentDate').prop('disabled', false);
        $('#deadline').prop('disabled', false);
        $('#assignedTo').prop('disabled', false);
        $('#projectId').focus();

    } else if (resultObj.status === 200) {
        $('#projectId').prop('disabled', true);
        fillData(resultObj);

        $('#change').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#projectName').prop('disabled', false);
        $('#assignmentDate').prop('disabled', false);
        $('#deadline').prop('disabled', false);
        $('#assignedTo').prop('disabled', false);
        $('#projectId').focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, DBname, RelationName);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#projectId').focus();
}

function changeData() {
    $('#change').prop('disabled', true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, DBname, RelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resultObj);
    resetForm();
    $('#projectId').focus();
}