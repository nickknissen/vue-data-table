<template>
<div class="container mx-auto mt-12 font-sans">
  <data-table
    :fetcher="getData"
    :initial-data="initialData"
    table-styles="w-full"
    >
      <template slot="actions" slot-scope="{ refreshData }">
        <div class="w-full flex justify-end">
          <button class="bg-teal-dark text-white py-4 px-2 mb-2" @click="refreshData">
            Refresh data
          </button>
        </div>
      </template>
      <template slot="columns" slot-scope="{isSorted, isSortedDesc, isSortedAsc, toggleSort}">
        <th class="font-thin p-4 border text-left">Navn</th>
        <th class="font-thin p-4 text-left border border-l-0">Email</th>
      </template>
      <template slot-scope="{row}">
        <td class="font-thin p-4 text-left border">{{ row.name }}</td>
        <td class="font-thin p-4 text-left border border-l-0">{{ row.email }}</td>
      </template>
    </data-table>
    </div>
</template>
<script>
import DataTable from '../components/DataTable.vue';

export default {
  components: {
    DataTable,
  },
  data: () => ({
    initialData: {
      data: [
        { email: 'o0sandar0o@mail.dk', name: 'Sandra' },
        { email: 'aksel@mail.dk', name: 'Aksel' },
        { email: 'd_bjørn@mail.dk', name: 'Bjørn' },
        { email: 'bernhard@mail.dk', name: 'Bernhard' },
      ],
      totalCount: 4,
    },
  }),
  methods: {
    getData() {
      const response = this.initialData;
      response.data.sort(() => Math.random() - 0.5);
      return Promise.resolve(response);
    },
  },
};
</script>
