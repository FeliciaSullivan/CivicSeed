# Setting up a Heroku deployment

A Heroku development environment is handy because they're free and easy to set up, and we can have multiple servers to test different multiplayer instances if we wish. Here is how you set it up. (We'll assume you already have a Heroku account with any SSH keys uploaded and command line tools installed.)

1. Create an app, either through the site or command line `heroku heroku apps:create civicseed-dev`. The app name can be something of your choosing.
2. Make sure Heroku is properly set as a Git remote for the Civic Seed repository so that we can push to it later.
3. Install add-ons. We'll use [MongoHQ](https://addons.heroku.com/mongohq) and [Redis To Go](https://addons.heroku.com/redistogo). Both have free tiers which will be enough for testing purposes.
`heroku addons:add mongohq`
`heroku addons:add redistogo`
4. You can verify that the add-ons are installed by typing `heroku config`. You should see two environment variables set, `MONGOHQ_URL` and `REDISTOGO_URL`.
5. Set other environment variables needed for Civic Seed.
`heroku config:set NODE_ENV=heroku` (The server script will check this to see if we are in a Heroku environment.)
`heroku config:set CLOUD_PATH=''` (That's a blank entry)
6. [Enable websockets on Heroku](https://devcenter.heroku.com/articles/heroku-labs-websockets). Be sure to include the app name you set in step 1.
`heroku labs:enable websockets -a civicseed-dev`
7. Now we are good to go, the rest of the instructions should be similar to setting up other development environments. For the first boot of the server, set the contents of `Procfile` in the root of the repository to `web: node test/boot`. Push the repository to Heroku with `git push heroku master`.
8. This should set up the server correctly. To verify, type `heroku logs` and see if it's outputting what you would expect.
9. If all is good, change `Procfile` contents to `web: npm start`. Push again to the server.
10. Now you should be able to go to `http://civicseed-dev.herokuapp.com/` (or whatever the app name is), log in as superuser, and complete the rest of the data initialization.

### Resetting everything

To reset everything, you should go back to step 7 and re-do the boot process - not sure yet if it's necessary to drop the Mongo and Redis databases first.

