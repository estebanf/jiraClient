const axios = require('axios').default;

const axiosGet = async function (endpoint, opts) {
    return axios.get(endpoint,{
        auth: {
            username: opts.username,
            password: opts.token
        }
    });
}
const axiosPost = async function (endpoint, opts, data) {
    return axios.post(endpoint, data, {
        auth: {
            username: opts.username,
            password: opts.token
        }
    });
}


const callJira = async function(opts,endpoint) {
    return axiosGet(endpoint,opts);
}

const callJiraPaginated = async function(opts,endpoint,key,startAt,inputData){
    let url = new URL(endpoint);
    if(!inputData){
        url.searchParams.append('startAt',(startAt ? startAt : 0));
        url.searchParams.append('maxResults',100);
    }
    else{
        inputData.startAt = startAt ? startAt : 0;
        inputData.maxResults = 100;
    }
    let results = inputData ? await axiosPost(url.href, opts, inputData) : await axiosGet(url.href,opts);
    let data = results.data;
    let batch = Number(data.startAt) + Number(data.maxResults);
    let total = Number(data.total);
    if(batch < total){
        let newStart = data.startAt +  data.maxResults;
        let newData = inputData ? await callJiraPaginated(opts,endpoint,key,newStart,inputData) : await callJiraPaginated(opts,endpoint,key,newStart);
        newData.forEach(element => {
            data[key].push(element);
        });
    }
    return data[key];;
}
exports.getFilters = function(opts){
    let endpoint = `${opts.server}/api/3/filter/search`;
    return callJiraPaginated(opts,endpoint,"values",0);
}
exports.getFilter = function(opts,filterId){
    let endpoint = `${opts.server}/api/3/filter/${filterId}`;
    return callJira(opts,endpoint);
}
exports.searchIssues = function(opts,data){
    let endpoint = `${opts.server}/api/3/search`;
    return callJiraPaginated(opts,endpoint,"issues",0,data);
}
exports.getChangeLog = function(opts,issueKey){
    let endpoint = `${opts.server}/api/3/issue/${issueKey}/changelog`;
    return callJiraPaginated(opts,endpoint,"values",0);
}
// exports.getSprintInfo = function(sprintId){
//     let endpoint = `https://8base-dev.atlassian.net/rest/agile/1.0/sprint/${sprintId}`;
//     return callJira(endpoint);
// }
// exports.getSprintIssues = function(sprintId,startAt){
//     let endpoint = `https://8base-dev.atlassian.net/rest/agile/1.0/sprint/${sprintId}/issue?startAt=${startAt}`;
//     return callJira(endpoint);
// }

// exports.getIssueWorkLog = function(issueId){
//     let endpoint = `https://8base-dev.atlassian.net/rest/api/3/issue/${issueId}/worklog`;
//     return callJira(endpoint);
// }

// exports.getIssueChangeLog = function(issueId,startAt){
//     let endpoint = `https://8base-dev.atlassian.net/rest/api/3/issue/${issueId}/changelog?startAt=${startAt}`;
//     return callJira(endpoint);
// }
// exports.getIssues = function(jiraIssue){
//     let endpoint = `https://8base-dev.atlassian.net/rest/api/3/issue/${jiraIssue}?expand=changelog`;
//     return callJira(endpoint);
// }