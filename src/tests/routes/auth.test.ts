import request from 'supertest';
import { faker } from '@faker-js/faker';
import StatusCodeEnum from '../../enums/StatusCodeEnums';
import { createApp } from '../../app';
import { generateToken } from '../../utils/jwt';
import UserModel from '../../models/UserModel';
import { User, UserEnum } from '../../interfaces/User';

const server = request(createApp);

let token: string;

const userObj = {
  name: faker.person.fullName(),
  address: faker.location.state(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  category: UserEnum.FARMER || UserEnum.AGRO_STORE,
  password: 'Test1234',
};
let seededTestUser: User | null;

beforeAll(async () => {
  const user = {
    name: userObj.name,
    address: userObj.address,
    phone: userObj.phone,
    category: userObj.category,
    email: userObj.email,
  };
  token = generateToken(user);

  seededTestUser = await UserModel.findOne({
    where: { email: 'test@gmail.com' },
  });
});

describe('Test POST user/create', () => {
  it('Should create user successfully', async () => {
    const res = await server
      .post('/user/create')
      .set({ authorization: `Bearer ${token}` })
      .send(userObj);

    expect(res.status).toBe(StatusCodeEnum.OK);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User created successfully');
  }, 10000);
});
