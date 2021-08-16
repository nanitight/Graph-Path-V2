const makeApp = require('../../app');
const supertest = require('supertest');
const {MongoClient} = require('mongodb')


describe('/getAllTasks',()=> {

    describe("when requested", ()=>{

        let connection;
        let MockDB;
        beforeAll(async () => {

            connection = await MongoClient.connect(global.__MONGO_URI__, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            MockDB = await connection.db(global.__MONGO_DB_NAME__);


        });
        afterAll(async () => {
            await connection.close();
            await MockDB.close();
        });

        it('it should return status code 200', async ()=> {
            let app = makeApp(AliDB);
            let response  = await supertest(app)
                .get('/task/getAllTasks')
                .expect(200)
                .then((res)=>{  })

        });
        it('it should return a JSON object', async ()=> {

            let app = makeApp(false,MockDB)
            const response = await supertest(app)
                .get('/task/getAllTasks')
                .expect(200)
                .then((res)=>{
                    expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
                })
        });
        it('it should return JSON object with all the task\'s fields', async ()=> {
            const Tasks = MockDB.collection('Tasks');
            let MockTask = {
                description: "Help Mark with his work",
                status: "in-progress",
                project: "Graph-Path",
                tasknr: 1,
                assignee: "Joe",
                assigner: "Alistair",
                due: Date.now(),
                issued: Date.now()+48,
            }
            await Tasks.insertOne(MockTask);
            let app = makeApp(false,MockDB)
            const response = await supertest(app)
                .get('/task/getAllTasks')
                .expect(200)
                .then((res)=>{
                    res.body
                    expect(res.body[0]['description']).toBeDefined()
                    expect(res.body[0]['status']).toBeDefined()
                    expect(res.body[0]['project']).toBeDefined()
                    expect(res.body[0]['tasknr']).toBeDefined()
                    expect(res.body[0]['assignee']).toBeDefined()
                    expect(res.body[0]['assigner']).toBeDefined()
                    expect(res.body[0]['due']).toBeDefined()
                    expect(res.body[0]['issued']).toBeDefined()

                })
        });
        it('it should return empty JSON object when there are no projects', async ()=>{
            var Tasks = MockDB.collection('Tasks');
            Tasks.deleteMany({})
            let app = makeApp(false,MockDB)
            const response = await supertest(app)
                .get('/task/getAllTasks')
                .expect(200)
                .then((res)=>{

                    expect(res.body).toStrictEqual([])
                })
        });
    })
});
