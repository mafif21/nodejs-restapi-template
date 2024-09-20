import {
    createManyTestCategory,
    createTestCategory,
    createTestUser,
    generateTestJWTToken,
    removeAllCategories,
    removeTestUser
} from "./test-util.js";
import supertest from "supertest";
import {web} from "../src/application/web.js";

describe('POST /api/categories/create', () => {
    let token;

    beforeEach(async () => {
        const user = await createTestUser()
        token = await generateTestJWTToken(user)
    })

    afterEach(async () => {
        await removeAllCategories()
        await removeTestUser()
    })

    it('should can create new category', async () => {
        const result = await supertest(web)
            .post('/api/categories/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "test"
            })

        expect(result.status).toBe(201);
        expect(result.body.data).toHaveProperty('id');
    });

    it('should reject if request is not valid', async () => {
        const result = await supertest(web)
            .post('/api/categories/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: ""
            })

        expect(result.status).toBe(400);
    });
});

describe('GET /api/categories/:categoryId', function () {
    let token;
    let categoryId

    beforeEach(async () => {
        const user = await createTestUser()
        token = await generateTestJWTToken(user)
        const category = await createTestCategory()
        categoryId = category.id
    })

    afterEach(async () => {
        await removeAllCategories()
        await removeTestUser()
    })

    it('should can get category', async () => {
        const result = await supertest(web)
            .get(`/api/categories/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(result.status).toBe(200);
    });

    it('should return 404 if contact id is not found', async () => {
        const result = await supertest(web)
            .get(`/api/categories/${categoryId + 1}`)
            .set('Authorization', `Bearer ${token}`)

        expect(result.status).toBe(404);
    });
});

describe('PUT /api/categories/:categoryId/edit', function () {
    let token;
    let categoryId;

    beforeEach(async () => {
        const user = await createTestUser()
        token = await generateTestJWTToken(user)
        const category = await createTestCategory()
        categoryId = category.id
    })

    afterEach(async () => {
        await removeAllCategories()
        await removeTestUser()
    })

    it('should can update existing category', async () => {
        const result = await supertest(web)
            .put(`/api/categories/${categoryId}/edit`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "test",
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(categoryId);
        expect(result.body.data.name).toBe("test");
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .put(`/api/categories/${categoryId}/edit`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "",
            });

        expect(result.status).toBe(400);
    });

    it('should reject if category is not found', async () => {
        const result = await supertest(web)
            .put(`/api/categories/${categoryId + 1}/edit`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "Sabun",
            });

        expect(result.status).toBe(404);
    });
});

describe('DELETE /api/categories/:categoryId', function () {
    let token;
    let categoryId

    beforeEach(async () => {
        const user = await createTestUser()
        token = await generateTestJWTToken(user)
        const category = await createTestCategory()
        categoryId = category.id
    })

    afterEach(async () => {
        await removeTestUser()
    })

    it('should can delete category', async () => {
        const result = await supertest(web)
            .delete(`/api/categories/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(result.status).toBe(200);
    });

    it('should return 404 if contact id is not found', async () => {
        const result = await supertest(web)
            .delete(`/api/categories/${categoryId + 1}`)
            .set('Authorization', `Bearer ${token}`)

        expect(result.status).toBe(404);
    });
});

describe('GET /api/categories', function () {
    let token;
    let categories

    beforeEach(async () => {
        const user = await createTestUser()
        token = await generateTestJWTToken(user)
        categories = await createManyTestCategory()

    })

    afterEach(async () => {
        await removeAllCategories()
        await removeTestUser()
    })

    it('should can get all categories', async () => {
        const result = await supertest(web)
            .get(`/api/categories`)
            .set('Authorization', `Bearer ${token}`)

        expect(result.status).toBe(200);
        expect(result.body.data.data.length).toBe(10);
        expect(result.body.data.paging.page).toBe(1);
        expect(result.body.data.paging.total_page).toBe(2);
        expect(result.body.data.paging.total_item).toBe(15);
    });

    it('should can search to page 2', async () => {
        const result = await supertest(web)
            .get(`/api/categories`)
            .query({
                page: 2
            })
            .set('Authorization', `Bearer ${token}`)

        expect(result.status).toBe(200);
        expect(result.body.data.data.length).toBe(5);
        expect(result.body.data.paging.page).toBe(2);
        expect(result.body.data.paging.total_page).toBe(2);
        expect(result.body.data.paging.total_item).toBe(15);
    });

    it('should can search using category name', async () => {
        const result = await supertest(web)
            .get(`/api/categories`)
            .query({
                name: 'test 4'
            })
            .set('Authorization', `Bearer ${token}`)

        expect(result.status).toBe(200);
        expect(result.body.data.data.length).toBe(1);
        expect(result.body.data.paging.page).toBe(1);
        expect(result.body.data.paging.total_page).toBe(1);
        expect(result.body.data.paging.total_item).toBe(1);
    });
});
