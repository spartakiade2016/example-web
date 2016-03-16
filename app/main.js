import $ from 'jquery';
import agent from 'multiagent';
import greeter from './greeter';

const DISCOVERY_SERVERS = [
  'http://46.101.245.190:8500',
  'http://46.101.132.55:8500',
  'http://46.101.193.82:8500'
];

const client = agent.client({
  discovery: 'consul',
  discoveryServers: DISCOVERY_SERVERS,
  discoveryStrategy: 'sequentially',
  serviceName: 'hello-world-service'
});

client.get('/healthcheck').end(function (err, res) {
  $('<p></p>').text(JSON.stringify(res.body)).appendTo('body');
});

$('<p></p>').text(greeter.greet('World')).appendTo('body');
