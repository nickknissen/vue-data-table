<template>
  <div>
    <slot name="actions"
      :hasSelectedData="selectedData.length >= 1"
      :selectedData="selectedData"
      :refreshData="refreshData"
      :loading="!loaded && !initialLoad"/>
    <table :class="this.tableStyles">
      <thead>
        <slot name="columns"
          :toggleAll="toggleAll"
          :isAllChecked="isAllChecked"
          :toggleSort="toggleSort"
          :isSortedAsc="isSortedAsc"
          :isSortedDesc="isSortedDesc"
          :isSorted="isSorted" />
      </thead>
      <tbody :style="[!loaded ? 'opacity: .5': '']">
        <tr v-for="(item, index) in visibleData" :key="index">
          <slot
            :row="item"
            :toggleSelection="toggleSelection"
            :isChecked="isChecked"/>
        </tr>
      </tbody>
    </table>
    <slot name="pagination"
        v-if="paginator.length > 1"
        :paginator="paginator"
        :currentPage="query.page" />
    <slot name="loading-message" v-if="!loaded && initialLoad"/>
    <slot name="no-result" v-if="!totalCount && loaded" />
  </div>
</template>
<script>
import { range, debounce, toQueryString, fromQueryString } from '../util';

export default {
  props: {
    fetcher: { required: true, type: Function },
    query: { default: () => ({}), type: Object },
    initialData: { default: null, type: Object },
    debounceMs: { default: 500, type: Number },
    useQueryString: { default: false, type: Boolean },
    tableStyles: { default: '', type: String },

    pageNumberKey: { default: 'page' },
    pageSizeKey: { default: 'pageSize' },
    totalCountKey: { default: 'totalCount' },
  },
  data: () => ({
    loaded: false,
    initialLoad: true,
    visibleData: [],
    selectedData: [],
    totalCount: 0,
  }),
  computed: {
    paginator() {
      const pageCount = this.pageSize ? Math.ceil(this.totalCount / this.pageSize) : 1;
      return range(pageCount).map(number => ({ number, isActive: number === this.pageNumber }));
    },
    pageNumber() {
      return this.query[this.pageNumberKey];
    },
    pageSize() {
      return this.query[this.pageSizeKey];
    },
    isAllChecked() {
      return this.selectedData.length === this.visibleData.length;
    },
  },
  created() {
    this.debouncedFetchVisibleData = this.debounceMs
      ? debounce(this.getVisibleData, this.debounceMs)
      : this.getVisibleData;

    if (this.useQueryString) {
      this.query = fromQueryString(this.query, window.location.search);
    }

    if (this.initialData) {
      this.hydrateWithInitialData();
      this.loadIfNotLoaded();
      return;
    }

    this.getVisibleData(this.query)
      .then(this.loadIfNotLoaded);
  },
  mounted() {
    this.$watch(
      'query',
      () => {
        // Reset to page 1 when searching
        if (this.query.filter && this.query.filter.search && this.query.page !== 1) {
          this.query.page = 1;
          this.$emit('update:query', this.query);
        }

        this.debouncedFetchVisibleData(this.query);
      },
      { deep: true },
    );
  },
  methods: {
    hydrateWithInitialData() {
      this.visibleData = this.initialData.data;
      this.totalCount = this.initialData[this.totalCountKey] || this.initialData.data.length;
    },
    refreshData() {
      this.getVisibleData(this.query);
    },
    getVisibleData(query) {
      this.loaded = false;
      if (this.useQueryString) {
        this.updateQueryString();
      }

      return this.fetcher({
        query,
        queryString: toQueryString(query),
      }).then((response) => {
        this.visibleData = response.data;
        this.totalCount = response[this.totalCountKey] || response.data.length;
        this.loaded = true;
      });
    },
    isChecked(item) {
      return this.selectedData.includes(item);
    },
    toggleAll() {
      if (this.isAllChecked) {
        this.selectedRows = [];
      } else {
        this.selectedData = this.visibleData.slice(0);
      }
    },
    toggleSelection(item) {
      const index = this.selectedData.indexOf(item);
      if (index !== -1) {
        this.selectedData.splice(index, 1);
      } else {
        this.selectedData.push(item);
      }
    },
    updateQueryString() {
      const query = toQueryString(this.query);

      window.history.replaceState(
        null,
        null,
        `${window.location.pathname}?${query}`,
      );
    },
    loadIfNotLoaded() {
      if (this.initialLoad) {
        this.initialLoad = false;
      }

      if (!this.loaded) {
        this.loaded = true;
      }
    },
    toggleSort(column) {
      if (!this.query.sort) {
        this.query.sort = column;
        return;
      }

      const currentSortOrder = this.query.sort.charAt(0) === '-' ? 'desc' : 'asc';
      const currentSortField = currentSortOrder === 'desc' ? this.query.sort.slice(1) : this.query.sort;

      if (column === currentSortField && currentSortOrder === 'asc') {
        this.query.sort = `-${column}`;
        return;
      }

      this.query.sort = column;
    },
    isSortedAsc(column) {
      return this.isSorted(column) && this.query.sort.charAt(0) !== '-';
    },
    isSortedDesc(column) {
      return this.isSorted(column) && this.query.sort.charAt(0) === '-';
    },
    isSorted(column) {
      return this.query.sort === column || this.query.sort === `-${column}`;
    },
  },
};
</script>
