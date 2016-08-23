# server-track

A -simple- dumb service that tracks server cpu and ram loading over time. Server metrics are stored in memory, so this isn't for production as restarting will loose all your stats.

## API

### `POST /server`

Accepts a JSON payload with the keys `name`, `cpu`, `ram`

```
{
  "name": <string>,
  "cpu": <float>,
  "ram": <float>
}
```

Response:

```
{
  "link": {
    "server": "/server/foobar"
  }
}
```

### `GET  /server/{name}`

Returns the server's CPU and RAM load averaged by the minute for the past hour and by the hour for the past 24 hours.

Response (abridged):

```
{
  "stats": {
    "ramAverage": {
      "byHour": [
        {
          "value": null,
          "ts": "2016-08-02T19:00:00.000Z"
        },

        {
          "value": null,
          "ts": "2016-08-03T15:00:00.000Z"
        },
        {
          "value": null,
          "ts": "2016-08-03T16:00:00.000Z"
        },
        {
          "value": null,
          "ts": "2016-08-03T17:00:00.000Z"
        },
        {
          "value": null,
          "ts": "2016-08-03T18:00:00.000Z"
        }
      ],
      "byMinute": [
        {
          "value": null,
          "ts": "2016-08-02T07:36:00.000Z"
        },

        {
          "value": 0.15,
          "ts": "2016-08-02T08:32:00.000Z"
        },
        {
          "value": null,
          "ts": "2016-08-02T08:33:00.000Z"
        },
        {
          "value": 0.15,
          "ts": "2016-08-02T08:34:00.000Z"
        },
        {
          "value": null,
          "ts": "2016-08-02T08:35:00.000Z"
        }
      ]
    },
    "cpuAverage": {
      "byHour": [
        {
          "value": null,
          "ts": "2016-08-02T19:00:00.000Z"
        },

        {
          "value": 0.3,
          "ts": "2016-08-02T08:32:00.000Z"
        },
        {
          "value": null,
          "ts": "2016-08-02T08:33:00.000Z"
        },
        {
          "value": 0.31,
          "ts": "2016-08-02T08:34:00.000Z"
        },
        {
          "value": null,
          "ts": "2016-08-02T08:35:00.000Z"
        }
      ]
    }
  },
  "link": {
    "self": "/server/foobar"
  },
  "name": "foobar"
}

```

## Development

Requires > Node v6.0

Getting started:

```
$ git clone https://github.com/craigbeck/server-track.git
$ cd server-track
$ npm install
```

Running service:

```
$ npm start
```

or use `npm run watch` to run service and restart when source changes are saved.

Running tests:

```
$ npm test
```

or use `npm run watch-test` to watch the source an run tests when source changes are saved.

There is a helper script `load.js` that can be used to simulate a number of servers posting (random) data to the service. Usage: `node load.js <number of servers>`
