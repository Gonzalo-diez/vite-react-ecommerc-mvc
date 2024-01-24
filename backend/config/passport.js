const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

const configurePassport = (passport) => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
            },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({ email }).exec();

                    if (!user || user.password !== password) {
                        return done(null, false, { message: "Credenciales inválidas" });
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};

module.exports = configurePassport;