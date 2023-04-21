const axios = require('axios').default;

const callJira = async function(opts,endpoint,startAt){
    let url = new URL(endpoint);
    url.searchParams.append('startAt',(startAt ? startAt : 0));
    url.searchParams.append('maxResults',100);
    let results = await axios.get(url.href,{
        auth: {
            username: opts.username,
            password: opts.token
        }
    });
    let data = results.data;
    if(!data.isLast){
        let newStart = data.startAt +  data.maxResults;
        let newData = await callJira(opts,endpoint,newStart);
        newData.forEach(element => {
            data.values.push(element);
        });
    }
    return data.values;
}
exports.getFilters = function(opts){
    let endpoint = `${opts.server}/api/3/filter/search`;
    return callJira(opts,endpoint);
}
exports.getSprintInfo = function(sprintId){
    let endpoint = `https://8base-dev.atlassian.net/rest/agile/1.0/sprint/${sprintId}`;
    return callJira(endpoint);
}
exports.getSprintIssues = function(sprintId,startAt){
    let endpoint = `https://8base-dev.atlassian.net/rest/agile/1.0/sprint/${sprintId}/issue?startAt=${startAt}`;
    return callJira(endpoint);
}

exports.getIssueWorkLog = function(issueId){
    let endpoint = `https://8base-dev.atlassian.net/rest/api/3/issue/${issueId}/worklog`;
    return callJira(endpoint);
}

exports.getIssueChangeLog = function(issueId,startAt){
    let endpoint = `https://8base-dev.atlassian.net/rest/api/3/issue/${issueId}/changelog?startAt=${startAt}`;
    return callJira(endpoint);
}
exports.getIssues = function(jiraIssue){
    let endpoint = `https://8base-dev.atlassian.net/rest/api/3/issue/${jiraIssue}?expand=changelog`;
    return callJira(endpoint);
}