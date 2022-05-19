<template>
	<header>
		Timezone offset: {{ new Date().getTimezoneOffset() }}
	</header>
	<main>
		<Qalendar :selected-date-default="new Date()" />
	</main>
</template>

<script setup lang="ts">
import Qalendar from "../Qalendar.vue";
</script>

<style></style>