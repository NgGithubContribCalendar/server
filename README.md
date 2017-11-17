Parse server for https://github.com/NgGithubContribCalendar

[![Coverage Status](https://img.shields.io/coveralls/github/NgGithubContribCalendar/server/master.svg?style=flat-square)](https://coveralls.io/github/NgGithubContribCalendar/server?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/NgGithubContribCalendar/server.svg)](https://greenkeeper.io/)
[![Build Status](https://img.shields.io/travis/NgGithubContribCalendar/server/master.svg?style=flat-square)](https://travis-ci.org/NgGithubContribCalendar/server)
![Known Vulnerabilities](https://snyk.io/test/github/NgGithubContribCalendar/server/badge.svg)
[![License](https://img.shields.io/github/license/NgGithubContribCalendar/server.svg?style=flat-square)](https://github.com/NgGithubContribCalendar/server/blob/master/LICENSE)
![Dependencies](https://img.shields.io/david/NgGithubContribCalendar/server.svg?style=flat-square)
![Dev Dependencies](https://img.shields.io/david/dev/NgGithubContribCalendar/server.svg?style=flat-square)

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://www.heroku.com/deploy/?template=https://github.com/NgGithubContribCalendar/server)

# Usage

Assuming your app is located at `https://example.com` and your GitHub username is `GithubStar`:

**Get the latest contributions**:

`GET https://example.com/fetch/GithubStar`

**Get the contributions from the year leading up to the 1st of November, 2015**:

`GET https://example.com/fetch/GithubStar?to=2015-11-01`
