<template>
<div class="container mx-auto mt-12 font-sans">
  <data-table
    :fetcher="getData"
    :query.sync="query"
    table-styles="w-full"
    >
      <template slot="columns" slot-scope="{isSorted, isSortedDesc, isSortedAsc, toggleSort}">
        <th
          @click="toggleSort('name')"
          class="cursor-pointer font-thin p-4 border text-left"
          :class="[isSorted('name') ? 'font-medium' : '']">
            Navn
          <span v-if="isSortedAsc('name')">⬆️</span>
          <span v-if="isSortedDesc('name')">⬇️️</span>
        </th>
        <th
          @click="toggleSort('email')"
          class="cursor-pointer font-thin p-4 text-left border border-l-0"
          :class="[isSorted('email') ? 'font-medium' : '']">
          Email
          <span v-if="isSortedAsc('email')">⬆️</span>
          <span v-if="isSortedDesc('email')">⬇️️</span>
        </th>
      </template>
      <template slot-scope="{row}">
        <td class="font-thin p-4 text-left border">{{ row.name }}</td>
        <td class="font-thin p-4 text-left border border-l-0">{{ row.email }}</td>
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
      sort: 'name',
    },
    queryString: '',
  }),
  methods: {
    dynamicSort(property) {
      let sortOrder = 1;
      if (property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1); // eslint-disable-line no-param-reassign
      }
      return function sort(a, b) {
        let result = 0;
        if (a[property] < b[property]) {
          result = -1;
        } else if (a[property] > b[property]) {
          result = 1;
        }

        return result * sortOrder;
      };
    },

    getData({ query, queryString }) {
      const data = [
        { email: 'o0sandar0o@mail.dk', name: 'Sandra' },
        { email: 'aksel@mail.dk', name: 'Aksel' },
        { email: 'd_bjørn@mail.dk', name: 'Bjørn' },
        { email: 'bernhard@mail.dk', name: 'Bernhard' },
      ];
      this.queryString = queryString;

      return Promise.resolve({
        data: data.sort(this.dynamicSort(query.sort)),
        totalCount: 4,
      });
    },
  },
};
</script>
