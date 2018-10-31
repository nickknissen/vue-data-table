/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import SortExample from '../examples/DataTableSort.vue';
import InitialDataExample from '../examples/DataTableInitialData.vue';
import FetchDataFromApi from '../examples/FetchDataFromAPI.vue';
import FilterDataFromApi from '../examples/FilterDataFromAPI.vue';

import '../assets/main.pcss';


storiesOf('DataTable', module)
  .add(
    'Sorting',
    () => ({
      components: { SortExample },
      template: '<sort-example />',
    }),
    { info: '☹️ no emojis' }, // Add additional info text directly
  )
  .add(
    'Preloaded with initial data',
    () => ({
      components: { InitialDataExample },
      template: '<initial-data-example />',
    }),
  )
  .add(
    'Fetch data from api',
    () => ({
      components: { FetchDataFromApi },
      template: '<fetch-data-from-api />',
    }),
  )
  .add(
    'Filter data from api',
    () => ({
      components: { FilterDataFromApi },
      template: '<filter-data-from-api />',
    }),
  );
