const client = require('./rest-client');
const R = require('ramda');
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
}

module.exports = Jira8Base;