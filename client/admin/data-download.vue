<template>
  <div class="row">
    <div class="col-sm-12">
    <h2>Data Download</h2>
    <table class="table">
    <thead>
      <tr>
        <th>Game</th>
        <th>Time Started</th>
        <th>Num Players</th>
        <th>Current/Last Round</th>
        <th>Download Data</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="game in games">
        <td>{{ game._id }}</td>
        <td>{{ game.timestamp.toLocaleString() }}</td>
        <td>{{ game.numPlayers }}</td>
        <td>{{ game.round }}</td>
        <td>
          <button class="btn btn-xs btn-primary" @click="dlNodes(game._id)">Nodes</button>
          <button class="btn btn-xs btn-success" @click="dlEdges(game._id)">Edges</button>
        </td>
      </tr>
    </tbody>
    </table>
    </div>
  </div>
</template>

<script>

function downloadCSV(res, filename) {
  const pom = document.createElement('a')
  pom.setAttribute("href", "data:text/csv," + encodeURIComponent(res))
  pom.setAttribute("download", filename)
  pom.click()
}

export default {
  meteor: {
    $subscribe: {
      'game': function() {
        return [ true ]; // Just get the active game
      }
    },
    games() {
      return Games.find({}, {sort: {timestamp: -1}});
    }
  },
  methods: {
    dlNodes(gameId) {
      Meteor.call('dl-node-data', gameId, (err, res) => {
        if (res) downloadCSV(res, "nodes.csv");
      });
    },
    dlEdges(gameId) {
      Meteor.call('dl-edge-data', gameId, (err, res) => {
        if (res) downloadCSV(res, "edges.csv");
      });
    }
  }
}
</script>
