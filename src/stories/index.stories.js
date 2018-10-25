/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import SortExample from '../examples/DataTableSort.vue';
import InitialDataExample from '../examples/DataTableInitialData.vue';
import '../assets/main.pcss';


storiesOf('DataTable', module)
  .add(
    'sorting',
    () => ({
      components: { SortExample },
      template: '<sort-example />',
    }),
    { info: '☹️ no emojis' }, // Add additional info text directly
  )
  .add(
    'preloaded with initial data',
    () => ({
      components: { InitialDataExample },
      template: '<initial-data-example />',
    }),
  );
