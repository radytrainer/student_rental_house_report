<template>
  <div class="min-h-screen bg-slate-100 flex items-start justify-center px-3 py-6">
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
            required
          />
        </div>

        <!-- REPORT CATEGORY -->
        <div>
          <label class="text-sm font-medium text-gray-700">
            Report Category
          </label>
          <select
            v-model="reportCategory"
            class="form-input"
            required
          >
            <option value="" disabled>Select category</option>
            <option value="rental">Rental House</option>
            <option value="school">School</option>
          </select>
        </div>

        <!-- DATE & TIME -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-medium text-gray-700">
              Issue Date
            </label>
            <input type="date" v-model="issueDate" class="form-input" required />
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">
              Issue Time
            </label>
            <input type="time" v-model="issueTime" class="form-input" required />
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
            required
          >
            <option value="" disabled>
              {{ reportCategory ? 'Select location' : 'Select category first' }}
            </option>

            <option
              v-for="loc in locationOptions"
              :key="loc"
              :value="loc"
            >
              {{ loc }}
            </option>
          </select>
        </div>

        <!-- ISSUE DESCRIPTION -->
        <div>
          <label class="text-sm font-medium text-gray-700">
            Issue Description
          </label>
          <textarea
            v-model="issue"
            rows="3"
            class="form-input resize-none"
            placeholder="Briefly describe the issue"
            required
          ></textarea>
        </div>

        <!-- SUPPORT NEEDED -->
        <div>
          <label class="text-sm font-medium text-gray-700">
            Support Needed
          </label>
          <textarea
            v-model="support"
            rows="2"
            class="form-input resize-none"
            placeholder="What support is required?"
            required
          ></textarea>
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

/* LOCATION OPTIONS */
const locationOptions = computed(() => {
  if (reportCategory.value === 'rental') {
    return [
      'Room',
      'Kitchen',
      'Bathroom',
      'Outside House',
      'Other'
    ]
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

/* RESET LOCATION WHEN CATEGORY CHANGES */
watch(reportCategory, () => {
  location.value = ''
})

/* SUBMIT */
const submitForm = async () => {
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

    /* RESET FORM */
    anonymous.value = true
    name.value = ''
    reportCategory.value = ''
    issueDate.value = ''
    issueTime.value = ''
    location.value = ''
    issue.value = ''
    support.value = ''

    toast.success('Report submitted successfully')

  } catch (error) {
    console.error(error)
    toast.error('Failed to submit report. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
