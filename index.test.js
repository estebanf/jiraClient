const jira8Base = require('./index');
const assert = require('assert').strict;

const initJira = function(){
    let jira = new jira8Base();
    let opts = {
        username: process.env.JIRAUSER,
        token: process.env.JIRATOKEN,
        server: process.env.JIRASERVER,
    }
    jira.init(opts);
    return jira;
}

describe("init the library", function(){
    it("should load the user filters",function(){
        let jira = initJira();
        return jira.getFilters().then(data => {
            assert.equal(data.length > 0, true);
        });
    })
});