import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  avatarImageId: String // will be used to get avatar from
});

export const User = mongoose.model('User', userSchema);
