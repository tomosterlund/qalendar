<template>
	<DatePicker locale="sv-SE" first-day-of-week="sunday" @updated="updateDate" />
</template>

<script lang="ts">
import {defineComponent} from "vue";
import DatePicker from "../components/header/DatePicker.vue";

export default defineComponent({
	name: 'DatePickerApp',

	components: {DatePicker},

	methods: {
		updateDate(event: { year: number; month: number; date: number; }) {
			console.log(event)
		}
	}
})
</script>

<style lang="scss" scoped>

</style>
