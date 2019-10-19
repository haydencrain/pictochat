import { SequelizeConnection } from '../utils/sequelize-connection';
import { strictEqual } from 'assert';
import { UserService } from '../services/user-service';
import { User } from '../models/user';
import { Model } from 'sequelize/types';

(SequelizeConnection as any).getInstance = jest.fn();

const incorrectDetails = {
  password: '123',
  username: 'admin'
};

const newDetails = {
  password: '123',
  username: 'testUser'
};

const userService = UserService;

describe('The UserService', () => {
  describe('when registering a user', () => {
    describe('if the username is already taken', () => {
      it('should throw an error', async () => {
        await expect(userService.createUser(incorrectDetails.username, incorrectDetails.password)).rejects.toThrowError(
          'Validation error'
        );
      });
    });
    describe('if the username is not taken', () => {
      it('should not throw an error', async () => {
        await expect(userService.createUser(newDetails.username, newDetails.password)).resolves.toBeDefined();
      });
    });
  });
  describe('when getting a user by their userId', () => {
    describe('if the user does not exist', () => {
      it('should throw an error', async () => {
        await expect(userService.getUser(123)).resolves.toBeNull();
      });
    });
    describe('if the user does exist', () => {
      it('should not be null', async () => {
        await expect(userService.getUser(1)).resolves.toBeDefined();
      });
    });
  });
  describe('when getting a user by their username', () => {
    describe('if the user does not exist', () => {
      it('should throw an error', async () => {
        await expect(userService.getUserByUsername('fake')).resolves.toBeNull();
      });
    });
    describe('if the user does exist', () => {
      it('should not be null', async () => {
        await expect(userService.getUserByUsername('admin')).resolves.toBeDefined();
      });
    });
  });
  describe('when updating a user', () => {
    describe('if the user does not exist', () => {
      it('should throw an error', async () => {
        await expect(userService.updateUser(123, { username: 'hello', email: 'world' })).rejects.toMatchObject({
          errorType: 'NOT_FOUND_ERROR',
          message: 'Not Found'
        });
      });
    });
    describe('if the user does exist', () => {
      it('should not be null', async () => {
        let user = User.findOne({ where: { username: newDetails.username } });
        expect(
          user.then(async user => {
            await expect(
              userService.updateUser(user.userId, { username: 'hello', email: 'world' })
            ).resolves.toBeDefined();
          })
        );
      });
      it('should delete the new row after creation', async () => {
        let user = User.findOne({ where: { username: newDetails.username } });
        expect(
          user.then(user => {
            return user.destroy();
          })
        );
      });
    });
  });
});
