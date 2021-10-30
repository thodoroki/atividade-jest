const fs = require('fs');
const request = require('supertest');
const app = require('../src/app');
const animalData = require('../src/data/animals.json')

describe('Cadastro de animais', () => {
    afterAll(() => {
        while(animalData.length > 0){
            animalData.pop();
        }
        fs.writeFileSync('src/data/animals.json', JSON.stringify(animalData));
    });

    it('deve cadastrar um animal com sucesso', async ()=>{
        const res = await request(app).post('/animais?nome=Spike&especie=Cachorro&idade=3');
        expect(res.status).toBe(201);
    });

    it('deve falhar no cadastro pois a idade deve ser um número', async ()=>{
        const res = await request(app).post('/animais?nome=Mimi&especie=Gato&idade=Jovem');
        expect(res.status).toBe(400);
    });

    it('deve falhar no cadastro pois o nome deve ter pelo menos 2 caracteres', async ()=>{
        const res = await request(app).post('/animais?nome=J&especie=Hamster&idade=1');
        expect(res.status).toBe(400);
    });
});

describe('Retorno de animais', () => {
    beforeAll(() => {
        animalData.push({
            'id':'idteste',
            'nome':'Maria',
            'especie': 'Cachorro',
            'idade': 2,
        });
        animalData.push({
            'id':'idteste',
            'nome':'Bichano',
            'especie': 'Gato',
            'idade': 3,
        });
        animalData.push({
            'id':'idteste',
            'nome':'Doguinho',
            'especie': 'Cachorro',
            'idade': 1,
        });
        fs.writeFileSync('src/data/animals.json', JSON.stringify(animalData));
    });

    afterAll(() => {
        while(animalData.length > 0){
            animalData.pop();
        }
        fs.writeFileSync('src/data/animals.json', JSON.stringify(animalData));
    });

    it('deve retornar uma lista com 3 animais', async ()=>{
        const res = await request(app).get('/animais');
        expect(res.status).toBe(200); 
        expect(res.body.length).toBe(3);
    });
});