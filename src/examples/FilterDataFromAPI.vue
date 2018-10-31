<template>
<div class="container mx-auto mt-12 font-sans">
  <data-table
    :fetcher="getData"
    :page-size="query.per_page"
    :query.sync="query"
    table-styles="w-full"
    >
      <template slot="actions">
        <div class="w-full flex justify-end mb-2">
          <div class="flex items-center">
          <label class="mr-2">State</label>
          <select v-model="query.state" class="border px-2 h-12">
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          </div>
        </div>
      </template>
      <template slot="columns" slot-scope="{isSorted, isSortedDesc, isSortedAsc, toggleSort}">
        <th class="font-thin p-4 border text-left">Title</th>
        <th class="font-thin p-4 border text-left">State</th>
        <th class="font-thin p-4 border text-left">Url</th>
      </template>
      <template slot-scope="{row}">
        <td class="font-thin p-4 text-left border">{{ row.title }}</td>
        <td class="font-thin p-4 text-left border border-l-0">{{ row.state }}</td>
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
      per_page: 5,
      state: 'open',
    },
    queryString: '',
  }),
  methods: {
    getTotalCountFromHeaders(headers) {
      const regex = /(?<!rel="last"),.*page=(\d+)&per_page=(\d+).*>;/g;
      const matches = regex.exec(headers.get('Link'));

      return parseInt(matches[1], 10) * parseInt(matches[2], 10);
    },
    getData({ queryString }) {
      this.queryString = queryString;
      return fetch(`https://api.github.com/repos/vuejs/vue/issues?${queryString}`)
        .then((response) => {
          const total = this.getTotalCountFromHeaders(response.headers);

          return response.json().then(data => ({ data, total }));
        });
    },
  },
};
</script>
