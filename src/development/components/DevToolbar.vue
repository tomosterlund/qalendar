<template>
	<transition name="slide">
		<div class="dev-toolbar" v-show="isVisible">
			<div>
				TZ offset: {{ new Date().getTimezoneOffset() }}
			</div>

			<select name="layout" id="layout" v-model="layout">
				<option value="none">No layout</option>
				<option value="sidebar">Sidebar</option>
				<option value="header">Header</option>
			</select>

			<select name="locale" id="locale" v-model="locale">
				<option value="en-US">en-US</option>
				<option value="de-DE">de-DE</option>
				<option value="sv-SE">sv-SE</option>
				<option value="ja-JP">ja-JP</option>
				<option value="ru-RU">ru-RU</option>
				<option value="zh-CN">zh-CN</option>
			</select>

			<button @click="isVisible = false">X</button>
		</div>
	</transition>

	<button v-if=" ! isVisible"
			class="toolbar-toggle"
			@click="isVisible = true">
		Dev toolbar
	</button>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name: 'DevToolbar',

	data() {
		return {
			isVisible: false,
			layout: 'none',
			locale: 'en-US',
		}
	},

	mounted() {
		const visibleSetting = localStorage.getItem('toolbar-visible')
		if (visibleSetting && visibleSetting === 'true') this.isVisible = true

		const layoutSetting = localStorage.getItem('layout-setting')
		if (layoutSetting) this.layout = layoutSetting

		const localeSetting = localStorage.getItem('locale-setting')
		if (localeSetting) this.locale = localeSetting
	},

	watch: {
		isVisible(value) {
			localStorage.setItem('toolbar-visible', value)
		},

		layout(value) {
			this.$emit('selected-layout', value)
			localStorage.setItem('layout-setting', value)
		},

		locale(value) {
			this.$emit('selected-locale', value)
			localStorage.setItem('locale-setting', value)
		}
	}
})
</script>

<style lang="scss" scoped>

.dev-toolbar {
	font-family: Courier, 'sans-serif';
	position: fixed;
	bottom: 20px;
	left: 50%;
	transform: translateX(-50%);
	height: 50px;
	padding: 10px;
	border-radius: 10px;
	background-color: #181818;
	color: #fff;
	display: flex;
	align-items: center;
	grid-gap: 40px;
	transition: all 0.2s ease;

	select {
		padding: 12px;
		font-family: inherit;
	}

	button {
		background-color: inherit;
		color: #fff;
		border: 0;
		font-size: 20px;
		cursor: pointer;
	}
}

.slide-enter-active,
.slide-leave-active {
	transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
	bottom: -100px;
}

.toolbar-toggle {
	position: fixed;
	bottom: 20px;
	right: 20px;
	background-color: #181818;
	color: #fff;
	padding: 8px 16px;
	font-family: Courier, 'sans-serif';
	border: 0;
	border-radius: 4px;
}

</style>
