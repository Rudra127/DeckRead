import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const secretsSchema = new mongoose.Schema({
  githubPatToken: {
    type: String,
    required: true,
  },
  githubUserName: {
    type: String,
    required: true,
  },
  awsClinetId: {
    type: String,
    required: true,
  },
  awsSecretKey: {
    type: String,
    required: true,
  },
  awsRegion: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      default: uuid,
    },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    DOB: {
      type: Date,
    },
    email: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"], // Ensures the email is in a valid format
      unique: true,
    },
    mobileNo: {
      type: Number,
    },
    countryCallingCode: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSecretsSet: {
      type: Boolean,
      required: true,
      default: false,
    },
    secretsSchema: {
      type: secretsSchema,
    },
  },
  {
    timestamps: true,
    // toJSON: {
    //   transform(doc, ret) {
    //     delete ret.password;
    //     delete ret.salt;
    //     return ret;
    //   }
    // },
    // toObject: {
    //   transform(doc, ret) {
    //     delete ret.password;
    //     delete ret.salt;
    //     return ret;
    //   }
    // }
  }
);

const userModel = mongoose.model("userDetails", userSchema);

export default userModel;
