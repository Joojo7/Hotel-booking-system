const userProfileModule = require("../models/users/userProfile.model");
// const GroupsHelper = require('./group.helper');

const {
  INPUT_OLD_PASSWORD,
  INPUT_NEW_PASSWORD,
  INPUT_EMAIL_OR_PHONE,
  WRONG_PASSWORD,
  OLD_PASSWORD_EQUALS_NEW,
  PASSWORD_NO_MATCH,
} = require("../errorDefinition/errors.map");

const bcrypt = require("bcrypt-nodejs");
const isEmpty = require("lodash/isEmpty");
const compact = require("lodash/compact");
const uniq = require("lodash/uniq");
class User {
  static async findByEmail(email, password) {
    let result;
    try {
      result = await userProfileModule.UserProfile.aggregate()
        .match({
          email: "iiwiirnj3@gmail.com",
        })
        .lookup({
          from: "user_types",
          localField: "user_type",
          foreignField: "user_type",
          as: "access_codes",
        })
        .unwind({ path: "$access_codes", preserveNullAndEmptyArrays: true })
        .project({
          uid: 1,
          email: 1,
          username: 1,
          is_email_verified: 1,
          phone: 1,
          avatar: 1,
          user_type: 1,
          tokens: 1,
          password: 1,
          access_codes: {
            $concatArrays: [
              "$access_codes.access_codes",
              {
                $ifNull: ["$extra_access_codes", []],
              },
            ],
          },
        });

      result = result[0];

      if (result) {
        if (bcrypt.compareSync(password, result.password)) {
          return result;
        }
        return null;
      }
      return null;
    } catch (e) {
      throw e;
    }
  }

  static async findByPhone(phone, password) {
    let result;

    phone = phone.replace(/\D/g, "");

    if (phone.length < 8) {
      return null;
    }

    const queryIndicator = phone.substr(phone.length - 8);

    try {
      const regexFactor = "" + queryIndicator + "$";
      result = await userProfileModule.UserProfile.aggregate()
        .match({
          phone: {
            $regex: regexFactor,
          },
        })
        .lookup({
          from: "user_types",
          localField: "user_type",
          foreignField: "user_type",
          as: "access_codes",
        })
        .unwind("access_codes")
        .project({
          uid: 1,
          email: 1,
          username: 1,
          is_email_verified: 1,
          country_code: 1,
          phone: 1,
          user_type: 1,
          avatar: 1,
          tokens: 1,
          password: 1,
          access_codes: {
            $concatArrays: [
              "$access_codes.access_codes",
              {
                $ifNull: ["$extra_access_codes", []],
              },
            ],
          },
        });

      if (result) {
        for (const user_itt of result) {
          if (bcrypt.compareSync(password, user_itt.password)) {
            return user_itt;
          }
        }

        return null;
      }
      return null;
    } catch (e) {
      throw e;
    }
  }

  static async getUserInfos(userInfo) {
    try {
      let result = await userProfileModule.UserProfile.find(
        {
          _id: { $in: userInfo },
        },
        ["phone", "email", "country_code"]
      ).limit(25);

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async update(uid, user) {
    try {
      if (user.length < 1) {
        return;
      }

      const objToUpdate = {};

      user.email ? (objToUpdate.email = user.email.trim().toLowerCase()) : null;
      user.rate ? (objToUpdate.rate = user.rate) : null;
      user.phone ? (objToUpdate.phone = user.phone) : null;
      user.country_code ? (objToUpdate.country_code = user.country_code) : null;
      user.username ? (objToUpdate.username = user.username) : null;
      // user.referral ? (objToUpdate.referral = user.referral) : null;
      user.ic_number ? (objToUpdate.ic_number = user.ic_number) : null;
      user.gender ? (objToUpdate.gender = user.gender) : null;
      user.avatar ? (objToUpdate.avatar = user.avatar) : null;
      user.user_type ? (objToUpdate.user_type = user.user_type) : null;
      user.password ? (objToUpdate.password = user.password) : null;
      user.reset_password_token
        ? (objToUpdate.reset_password_token = user.reset_password_token)
        : null;
      user.reset_password_token_expire_at
        ? (objToUpdate.reset_password_token_expire_at =
            user.reset_password_token_expire_at)
        : null;

      if (user.new_password || user.old_password) {
        if (!user.old_password) {
          throw INPUT_OLD_PASSWORD;
        }
        if (!user.new_password) {
          throw INPUT_NEW_PASSWORD;
        }
        if (user.new_password !== user.confirm_password) {
          throw PASSWORD_NO_MATCH;
        }
        if (!user.email && !user.phone) {
          throw INPUT_EMAIL_OR_PHONE;
        }
        let correctPassword = "";
        if (user.email) {
          correctPassword = await this.findByEmail(
            user.email.trim(),
            user.old_password.trim()
          );
        } else if (user.phone) {
          correctPassword = await this.findByPhone(
            user.phone.trim(),
            user.old_password.trim()
          );
        }

        if (!correctPassword) {
          throw WRONG_PASSWORD;
        }

        if (user.new_password === user.old_password) {
          throw OLD_PASSWORD_EQUALS_NEW;
        }

        objToUpdate.password = await this.hashPassword(user.new_password);
      }

      if (user.location) {
        objToUpdate.location = user.location;
      }

      if (objToUpdate.email) {
        objToUpdate.is_email_verified = false;
      }

      const result = await userProfileModule.UserProfile.findOneAndUpdate(
        {
          uid,
        },
        objToUpdate,
        {
          new: true,
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async hashPassword(password) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);
      if (!hashPass) {
        throw new Error("Salt is not generated!");
      }

      return hashPass;
    } catch (e) {
      // @Todo log the error
      throw e;
    }
  }

  static async userExists(email, phone) {
    try {
      phone = phone.replace(/\D/g, "");

      if (phone.length < 8) {
        return true;
      }

      const queryIndicator = phone.substr(phone.length - 8);

      const regexFactor = "" + queryIndicator + "$";

      // check if user already exists
      let userExist = await userProfileModule.UserProfile.find({
        $or: [
          {
            email: email,
          },
          {
            phone: {
              $regex: regexFactor,
            },
          },
        ],
      });

      return userExist.length > 0;
    } catch (e) {
      // @TODO log the error
      console.log(e);
      throw e;
    }
  }

  static async getUserIfExist({ email = "", phone = "" }) {
    try {
      email = email.trim().toLowerCase();

      phone = phone.replace(/\D/g, "");

      const queryIndicator = phone.substr(phone.length - 8);

      const regexFactor = "" + queryIndicator + "$";

      let user;

      if (email) {
        user = await userProfileModule.UserProfile.findOne({ email });
      } else {
        user = await userProfileModule.UserProfile.findOne({
          phone: {
            $regex: regexFactor,
          },
        });
      }

      if (!user) {
        return false;
      }

      return user;
    } catch (e) {
      // @TODO log the error
      console.log(e);
      throw e;
    }
  }

  static async create(request, password) {
    try {
      let user = new userProfileModule.UserProfile({
        email: request.email.trim().toLowerCase(),
        phone: request.phone.trim(),
        username: request.username.trim(),
        password: password,
        client: request.client,
      });
      user.last_update = String(Date.now());
      user.uid = user._id.toString();
      user.old_uid = "";
      await user.save();

      //  let makeUserInfo = {
      //      uid: user.uid
      //  };

      //  let userInfo = new userInformationModule.UserInformation(makeUserInfo);
      //  userInfo.save();

      return user;
    } catch (e) {
      throw e;
    }
  }

  static async findById(_id) {
    let result;
    try {
      result = await userProfileModule.UserProfile.findOne({
        _id: _id,
      });

      if (result) {
        return result;
      }
      return null;
    } catch (e) {
      throw e;
    }
  }

  static async findByUid(uid) {
    try {
      const result = await userProfileModule.UserProfile.aggregate()
        .match({ uid })
        .lookup({
          from: "user_types",
          localField: "user_type",
          foreignField: "user_type",
          as: "access_codes",
        })
        .lookup({
          from: "barcodes",
          localField: "uid",
          foreignField: "uid",
          as: "barcodes",
        })
        .unwind("access_codes")
        .project({
          uid: 1,
          email: 1,
          username: 1,
          country_code: 1,
          phone: 1,
          gender: 1,
          avatar: 1,
          ic_number: 1,
          user_type: 1,
          location: 1,
          barcodes: "$barcodes.barcode",
          access_codes: {
            $concatArrays: [
              "$access_codes.access_codes",
              {
                $ifNull: ["$extra_access_codes", []],
              },
            ],
          },
        });

      return result[0];
    } catch (e) {
      throw e;
    }
  }

  static async getUsers(options) {
    try {
      return this.getAllUsers(options);
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers({
    sort,
    order,
    page,
    pageSize,
    filter,
    fromDate,
    toDate,
  }) {
    try {
      sort = sort || "email";
      order = order || "asc";
      page = page || 1;
      const recordPerPage = parseInt(pageSize) || 10;
      const startIndex = (parseInt(page) - 1) * recordPerPage;
      filter = filter || "";

      const query = userProfileModule.UserProfile.aggregate();
      // filter
      if (fromDate && toDate) {
        query.match({
          registration_date: {
            $lte: new Date(toDate),
            $gte: new Date(fromDate),
          },
        });
      }
      if (filter) {
        query.match({
          $or: [
            {
              username: {
                $regex: `${filter}`,
                $options: "xi",
              },
            },
            {
              email: {
                $regex: filter,
                $options: "xi",
              },
            },
            {
              phone: {
                $regex: filter,
                $options: "xi",
              },
            },
            {
              uid: {
                $regex: filter,
                $options: "xi",
              },
            },
          ],
        });
      }

      query.project({
        email: 1,
        phone: 1,
        location: 1,
        registration_date: 1,
        // barcodes: 1,
        username: 1,
        uid: 1,
      });

      // sort
      query
        .sort({
          [sort]: order,
        })

        .group({
          _id: null,
          total_count: {
            $sum: 1,
          },
          data: {
            $push: "$$ROOT",
          },
        })

        .project({
          _id: false,
          total_count: true,
          data: {
            $slice: ["$data", startIndex, recordPerPage],
          },
        });

      const uesrs = await query;
      return uesrs[0] || [];
    } catch (error) {
      throw error;
    }
  }

  static async getUserType(uid) {
    try {
      const user = await userProfileModule.UserProfile.findOne({
        uid,
      });
      return user.user_type;
    } catch (error) {
      throw error;
    }
  }

  static async getUserByToken(token) {
    const user = await userProfileModule.UserProfile.aggregate()
      .match({ "tokens.token": token })
      .lookup({
        from: "user_types",
        localField: "user_type",
        foreignField: "user_type",
        as: "access_codes",
      })
      .unwind("access_codes")
      .project({
        uid: 1,
        email: 1,
        username: 1,
        country_code: 1,
        phone: 1,
        user_type: 1,
        tokens: 1,
        password: 1,
        access_codes: {
          $concatArrays: [
            "$access_codes.access_codes",
            {
              $ifNull: ["$extra_access_codes", []],
            },
          ],
        },
      });

    return user[0];
  }
}

module.exports = User;
