<template>
  <div class="min-h-screen bg-slate-100 flex justify-center px-3 py-6">
    <div class="w-full max-w-2xl bg-white rounded-lg shadow-sm border">

      <!-- HEADER -->
      <div class="flex items-center gap-4 border-b px-5 py-4">
        <img src="/pn-logo.png" class="h-10 w-10 object-contain" />
        <div>
          <h2 class="text-lg font-semibold text-gray-800">
            General Issue Report
          </h2>
          <p class="text-xs text-gray-500">
            All reports are confidential
          </p>
        </div>
      </div>

      <!-- FORM -->
      <form @submit.prevent="submitForm" class="px-5 py-4 space-y-4">

        <!-- REPORT AS -->
        <div>
          <label class="text-sm font-medium text-gray-700">
            Report As
          </label>
          <div class="flex gap-6 mt-1 text-sm">
            <label class="flex items-center gap-2">
              <input type="radio" v-model="anonymous" :value="true" />
              Anonymous
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" v-model="anonymous" :value="false" />
              With Name
            </label>
          </div>
        </div>

        <!-- NAME -->
        <div v-if="!anonymous">
          <label class="text-sm font-medium text-gray-700">
            Your Name
          </label>
          <input
            v-model="name"
            type="text"
            class="form-input"
            placeholder="Full name"
          />
          <p v-if="errors.name" class="error-text">
            {{ errors.name }}
          </p>
        </div>

        <!-- CATEGORY -->
        <div>
          <label class="text-sm font-medium text-gray-700">
            Report Category
          </label>
          <select v-model="reportCategory" class="form-input">
            <option value="" disabled>Select category</option>
            <option value="rental">Rental House</option>
            <option value="school">School</option>
          </select>
          <p v-if="errors.reportCategory" class="error-text">
            {{ errors.reportCategory }}
          </p>
        </div>

        <!-- DATE & TIME -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-medium text-gray-700">
              Issue Date
            </label>
            <input type="date" v-model="issueDate" class="form-input" />
            <p v-if="errors.issueDate" class="error-text">
              {{ errors.issueDate }}
            </p>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700">
              Issue Time
            </label>
            <input type="time" v-model="issueTime" class="form-input" />
            <p v-if="errors.issueTime" class="error-text">
              {{ errors.issueTime }}
            </p>
          </div>
        </div>

        <!-- LOCATION -->
        <div>
          <label class="text-sm font-medium text-gray-700">
            Location
          </label>
          <select
            v-model="location"
            class="form-input"
            :disabled="!reportCategory"
          >
            <option value="" disabled>
              {{ reportCategory ? 'Select location' : 'Select category first' }}
            </option>
            <option v-for="loc in locationOptions" :key="loc" :value="loc">
              {{ loc }}
            </option>
          </select>
          <p v-if="errors.location" class="error-text">
            {{ errors.location }}
          </p>
        </div>

        <!-- ISSUE -->
        <div>
          <label class="text-sm font-medium text-gray-700">
            Issue Description
          </label>
          <textarea
            v-model="issue"
            rows="3"
            class="form-input resize-none"
            placeholder="Describe the issue"
          ></textarea>
          <p v-if="errors.issue" class="error-text">
            {{ errors.issue }}
          </p>
        </div>

        <!-- SUPPORT -->
        <div>
          <label class="text-sm font-medium text-gray-700">
            Support Needed
          </label>
          <textarea
            v-model="support"
            rows="2"
            class="form-input resize-none"
            placeholder="What support is required?"
          ></textarea>
          <p v-if="errors.support" class="error-text">
            {{ errors.support }}
          </p>
        </div>

        <!-- SUBMIT -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700
                 text-white py-2.5 rounded-md text-sm font-semibold
                 disabled:opacity-50 transition"
        >
          {{ loading ? 'Submitting...' : 'Submit Report' }}
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { sendReport } from './services/reportService'
import { useToast } from 'vue-toast-notification'

const toast = useToast()

/* STATE */
const anonymous = ref(true)
const name = ref('')
const reportCategory = ref('')
const issueDate = ref('')
const issueTime = ref('')
const location = ref('')
const issue = ref('')
const support = ref('')
const loading = ref(false)
const errors = ref({})

/* LOCATION OPTIONS */
const locationOptions = computed(() => {
  if (reportCategory.value === 'rental') {
    return ['Room', 'Kitchen', 'Bathroom', 'Outside House', 'Other']
  }
  if (reportCategory.value === 'school') {
    return [
      'Classroom',
      'Meeting Room',
      'Library',
      'Teacher Office',
      'Playground',
      'Parking Area',
      'Other'
    ]
  }
  return []
})

watch(reportCategory, () => {
  location.value = ''
})

/* VALIDATION */
const validateForm = () => {
  const e = {}

  if (!anonymous.value && !name.value.trim()) {
    e.name = 'Name is required'
  }
  if (!reportCategory.value) {
    e.reportCategory = 'Category is required'
  }
  if (!issueDate.value) {
    e.issueDate = 'Date is required'
  }
  if (!issueTime.value) {
    e.issueTime = 'Time is required'
  }
  if (!location.value) {
    e.location = 'Location is required'
  }
  if (!issue.value || issue.value.length < 10) {
    e.issue = 'Minimum 10 characters required'
  }
  if (!support.value || support.value.length < 5) {
    e.support = 'Minimum 5 characters required'
  }

  errors.value = e
  return Object.keys(e).length === 0
}

/* SUBMIT */
const submitForm = async () => {
  if (!validateForm()) {
    toast.error('Please fix the highlighted errors')
    return
  }

  loading.value = true

  try {
    const formData = new FormData()
    formData.append('anonymous', anonymous.value ? 'Yes' : 'No')
    formData.append('name', anonymous.value ? 'Anonymous' : name.value)
    formData.append('report_category', reportCategory.value)
    formData.append('issue_date', issueDate.value)
    formData.append('issue_time', issueTime.value)
    formData.append('location', location.value)
    formData.append('issue', issue.value)
    formData.append('support', support.value)

    await sendReport(formData)

    Object.assign(
      { value: anonymous }, { value: true }
    )

    anonymous.value = true
    name.value = ''
    reportCategory.value = ''
    issueDate.value = ''
    issueTime.value = ''
    location.value = ''
    issue.value = ''
    support.value = ''
    errors.value = {}

    toast.success('Report submitted successfully')
  } catch (err) {
    console.error(err)
    toast.error('Submission failed. Try again.')
  } finally {
    loading.value = false
  }
}
</script>

<style>
.form-input {
  @apply w-full border border-gray-300 rounded-md px-3 py-2
         text-sm focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.error-text {
  @apply text-xs text-red-600 mt-1;
}
</style>
