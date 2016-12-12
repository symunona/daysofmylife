import * as Koa from 'koa';
import User from '../models/User'
import Persistence from '../persistence/Persistence'
import * as fs from "fs";
import * as KoaRouter from 'koa-router';

const config = require('../../config/general.json');

const convert = require('koa-convert')
const session = require('koa-generic-session')
const bodyParser = require('koa-bodyparser')
const passport = require('koa-passport')

const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const GoogleStrategy = require('passport-google-auth').Strategy

export default class Auth {

    private user: User;
    persistence: Persistence;

    public static auth(next){
        
        if (!this.isAuthenticated()) {
            console.warn('[Auth] tried to reach ', this.request.url);
            this.redirect('/login');
        }
        else{
            console.log('[Auth] granted ', this.request.url);
            // next()
        }        
    }

    constructor(app: Koa) {

        this.persistence = Persistence.getInstance();
        let route = new KoaRouter();

        app.use(bodyParser())
        app.use(convert(session()));
        app.use(passport.initialize())
        app.use(passport.session())



        const fetchUser = (userFilter) => {
             
            // This is an example! Use password hashing in your
            // const user = { id: 1, username: 'test', password: 'test' }
            console.log('fetchUser', userFilter)
            return this.persistence.persistenceModels.User.findOne({where: userFilter});
        }

        passport.serializeUser(function (user, done) {
            console.log('serializeUser', user.id)
            done(null, user.id)
        })

        passport.deserializeUser(async function (id, done) {
            console.log('deserializeUser', id)
            try {
                const user = await fetchUser({id})
                done(null, user)
            } catch (err) {
                done(err)
            }
        })


        passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },function (email, password, done) {
            fetchUser({email: email})
                .then(user => {
                    console.log('user found', user.id)
                    if (email === user.email && password === user.password) {
                        console.log('authed')
                        done(null, user)
                    } else {
                        console.log('rejected')
                        done(null, false)
                    }
                })
                .catch(err => done(err))
        }))


        passport.use(new FacebookStrategy({
            clientID: 'your-client-id',
            clientSecret: 'your-secret',
            callbackURL: config.callback_root + '/auth/facebook/callback'
        },
            function (token, tokenSecret, profile, done) {
                console.log('fb profile', profile);
                // retrieve user ...
                fetchUser({fbid: profile.id}).then(user => done(null, user))
            }
        ))


        passport.use(new TwitterStrategy({
            consumerKey: 'your-consumer-key',
            consumerSecret: 'your-secret',
            callbackURL: config.callback_root + (process.env.PORT || 3000) + '/auth/twitter/callback'
        },
            function (token, tokenSecret, profile, done) {
                // retrieve user ...
                console.log('tw profile', profile);
                fetchUser({twid: profile.id}).then(user => done(null, user))
            }
        ))
        passport.use(new GoogleStrategy({
            clientId: 'your-client-id',
            clientSecret: 'your-secret',
            callbackURL: config.callback_root + (process.env.PORT || 3000) + '/auth/google/callback'
        },
            function (token, tokenSecret, profile, done) {
                // retrieve user ...
                console.log('ggle profile', profile);
                fetchUser({gid: profile.id}).then(user => done(null, user))
            }
        ))

        route.post('/login',
            passport.authenticate('local', {
                successRedirect: '/app',
                failureRedirect: '/'
            }))


        route.get('/logout', function () {
            this.logout()
            this.redirect('/')
        })

        route.get('/auth/facebook',
            passport.authenticate('facebook')
        )

        route.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect: '/app',
                failureRedirect: '/'
            })
        )

        route.get('/auth/twitter',
            passport.authenticate('twitter')
        )

        route.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect: '/app',
                failureRedirect: '/'
            })
        )

        route.get('/auth/google',
            passport.authenticate('google')
        )

        route.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect: '/app',
                failureRedirect: '/'
            })
        )

        app.use(route.routes());
    }



}
