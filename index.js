const client = require('./rest-client');
const R = require('ramda');
const mapIssueData = function(fields,data) {
    const mapData = R.map((x => {
        let obj = {};
        obj.key = x.key;
        fields.forEach(field => {
            let fieldValue = x.fields[field];
            if(fieldValue === null || fieldValue === undefined){
                obj[field] = null;
            }
            else{
                if(fieldValue.value) {
                    obj[field] = fieldValue.value;
                }
                else{
                    if(fieldValue.name){
                        obj[field] = fieldValue.name;
                    }
                    else{
                        if(fieldValue.displayName){
                            obj[field] = fieldValue.displayName;
                        }
                        else{
                            if(fieldValue.fields && fieldValue.fields.summary){
                                obj[field] = fieldValue.fields.summary;
                            }
                            else{
                                obj[field] = fieldValue;
                            }
                        }
                    }
                }
            }
        });
        return obj;
    }),data);
    return mapData;
}


class Jira8Base {
    constructor() { }
    init(opts) {
        this.settings = opts;
    }
    async getFilters(){
        const mapData =R.map((x => {
            return {id: x.id, name:x.name};
        }));
        const sortData = R.sortBy((x=> x.name));

        let data=  await client.getFilters(this.settings);

        return sortData(mapData(data));
    }
    async searchIssues(fields, jql){
        let issuesData = await client.searchIssues(this.settings,{fields:fields, jql:jql});
        return mapIssueData(fields,issuesData);
    }
    async getIssues(filterId, fields){
        // const mapData = R.map((x => {
        //     let obj = {};
        //     obj.key = x.key;
        //     fields.forEach(field => {
        //         let fieldValue = x.fields[field];
        //         if(fieldValue === null || fieldValue === undefined){
        //             obj[field] = null;
        //         }
        //         else{
        //             if(fieldValue.value) {
        //                 obj[field] = fieldValue.value;
        //             }
        //             else{
        //                 if(fieldValue.name){
        //                     obj[field] = fieldValue.name;
        //                 }
        //                 else{
        //                     if(fieldValue.displayName){
        //                         obj[field] = fieldValue.displayName;
        //                     }
        //                     else{
        //                         if(fieldValue.fields && fieldValue.fields.summary){
        //                             obj[field] = fieldValue.fields.summary;
        //                         }
        //                         else{
        //                             obj[field] = fieldValue;
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     });
        //     return obj;
        // }));
        const sortData = R.sortBy((x=> x.key));

        let filterData = await client.getFilter(this.settings,filterId);
        let jql = filterData.data.jql;
        let issuesData = await client.searchIssues(this.settings,{fields:fields, jql:jql});
        return sortData(mapIssueData(fields,issuesData));
    }
    async getHistory(issueKey){
        const mapData =R.map((x => {
            return {field: x.field};
        }));

        let historyData = await client.getChangeLog(this.settings,issueKey);
        let data = [];
        historyData.forEach(element => {
            let mappedItems = mapData(element.items);
            let index = R.indexOf({field: "status"},mappedItems);
            if(index > -1){
                data.push({
                    created: element.created,
                    by: element.author.displayName,
                    from: element.items[index].fromString,
                    to: element.items[index].toString
                })
            }
        });
        return data;
    }
}

module.exports = Jira8Base;