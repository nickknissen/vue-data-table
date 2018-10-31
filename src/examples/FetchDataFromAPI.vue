<template>
<div class="container mx-auto mt-12 font-sans">
  <data-table
    :fetcher="getData"
    :query.sync="query"
    total-count-key="total"
    page-size-key="per_page"
    page-number-key="page"
    table-styles="w-full"
    >
      <template slot="columns" slot-scope="{isSorted, isSortedDesc, isSortedAsc, toggleSort}">
        <th class="font-thin p-4 border text-left">Filename</th>
        <th class="font-thin p-4 border text-left">Description</th>
        <th class="font-thin p-4 border text-left">Url</th>
      </template>
      <template slot-scope="{row}">
        <td class="font-thin p-4 text-left border">{{ getFirstFile(row).filename }}</td>
        <td class="font-thin p-4 text-left border border-l-0">{{ row.description}}</td>
        <td class="font-thin p-4 text-left border border-l-0">
          <a target="_blank" class="no-underline" :href="row.html_url">Link</a>
        </td>
      </template>

      <template slot="pagination" slot-scope="{ paginator }">
        <div class="flex justify-end mt-2">
        <select v-model="query.page" class="p-2 border text-right">
          <option v-for="page in paginator" :key="page.number" :value="page.number">
            {{ page.number }}
          </option>
        </select>
        </div>
      </template>
  </data-table>
  <div class="flex">
    <div class="w-1/2">
      <h2 class="my-4">Query object</h2>
      <pre>{{query}}</pre>
    </div>
    <div class="w-1/2">
      <h2 class="my-4">Query string</h2>
      <pre>{{queryString}}</pre>
    </div>
  </div>
</div>
</template>
<script>
import DataTable from '../components/DataTable.vue';

export default {
  components: {
    DataTable,
  },
  data: () => ({
    query: {
      page: 1,
      per_page: 10,
    },
    queryString: '',
  }),
  methods: {
    getFirstFile(row) {
      return row.files[Object.keys(row.files)[0]];
    },
    getTotalCountFromHeaders(headers) {
      const regex = /page=(\d+)&per_page=(\d+)>; rel="last"/g;
      const matches = regex.exec(headers.get('Link'));

      return parseInt(matches[1], 10) * parseInt(matches[2], 10);
    },
    getData({ queryString }) {
      this.queryString = queryString;
      return fetch(`https://api.github.com/gists/public?${queryString}`)
        .then((response) => {
          const total = this.getTotalCountFromHeaders(response.headers);

          return response.json().then(data => ({ data, total }));
        });
    },
  },
};
</script>
