const jira8Base = require('./index');
const { config } = require('dotenv');
config();
const assert = require('assert').strict;

const initJira = function () {
    let jira = new jira8Base();
    let opts = {
        username: process.env.JIRAUSER,
        token: process.env.JIRATOKEN,
        server: process.env.JIRASERVER,
    }
    jira.init(opts);
    return jira;
}

describe("jira front", function () {
    it("should load the user filters", function () {
        let jira = initJira();
        return jira.getFilters().then(data => {
            assert.equal(data.length > 0, true);
        });
    })
    it("should return the list of issues", function () {
        let jira = initJira();
        let fields = [
            "summary",
            "customfield_10195",
            "customfield_10196",
            "labels",
            "customfield_10173",
            "issuetype",
            "updated",
            "created"
        ];
        return jira.getIssues(10408, fields).then(data => {
            assert.equal(data.length > 0, true);
            data.forEach(element => {
                fields.forEach(field => {
                    assert.equal(element.hasOwnProperty(field), true);
                });
            });
        });
    })
    it("shoult return the history of an issue", function () {
        let jira = initJira();
        return jira.getHistory("PRODUCT-43").then(data => {
            assert.equal(data.length > 0, true);
        });
    });
});