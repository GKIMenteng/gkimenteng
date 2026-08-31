<template>
  <div>
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-calendar3 me-2"></i>Church Calendar
      </h1>
      <p class="lead fs-5 mb-4" style="color: var(--dark-light);">
        Stay connected with our events and activities
      </p>
      <button
        v-if="userStore.isManager"
        class="btn btn-church-primary"
        @click="openCreateModal"
      >
        <i class="bi bi-plus-circle me-2"></i>Add Event
      </button>
    </div>

    <!-- Loading -->
    <div v-if="eStore.loading || volStore.loading" class="text-center py-5">
      <div class="spinner-border" style="color: var(--gold);" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <template v-else>
      <!-- Calendar Grid -->
      <div class="church-card p-3 p-lg-4 mb-4 animate-fade-in-up">
        <div class="d-flex justify-content-between align-items-center mb-4 px-2">
          <button class="btn btn-church-outline px-3" @click="previousMonth">
            <i class="bi bi-chevron-left"></i>
          </button>
          <h3 class="mb-0" style="color: var(--burgundy); font-family: var(--font-heading);">
            {{ currentMonthName }} {{ currentYear }}
          </h3>
          <button class="btn btn-church-outline px-3" @click="nextMonth">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>

        <div class="row g-1 mb-2">
          <div
            class="col text-center fw-semibold py-2"
            style="color: var(--burgundy-light); font-size: 0.85rem; letter-spacing: 0.5px; text-transform: uppercase;"
            v-for="day in daysOfWeek"
            :key="day"
          >
            {{ day }}
          </div>
        </div>

        <div class="row g-1">
          <div
            class="col-1-7 p-1"
            v-for="(day, index) in calendarDays"
            :key="index"
          >
            <div
              class="calendar-day p-1 p-md-2 d-flex flex-column cursor-pointer"
              :class="{ today: isToday(day), 'has-event': day && currentMonthEvents(day).length > 0 }"
              v-if="day"
              @click="openDayModal(day)"
            >
              <div class="day-number mb-1">{{ day }}</div>
              <div class="flex-grow-1 d-flex flex-column gap-1">
                <div v-for="ev in currentMonthEvents(day).slice(0, 2)" :key="ev.id">
                  <span
                    class="badge-church d-inline-block text-truncate cursor-pointer"
                    style="font-size: 0.6rem; padding: 0.15rem 0.4rem; max-width: 100%;"
                    :title="ev.name"
                    @click.stop="openDetailModal(ev)"
                  >
                    {{ ev.name }}
                  </span>
                </div>
                <small
                  v-if="currentMonthEvents(day).length > 2"
                  style="color: var(--gold-dark); font-size: 0.6rem; font-weight: 600;"
                >
                  +{{ currentMonthEvents(day).length - 2 }} more
                </small>
              </div>
            </div>
            <div v-else class="calendar-day p-2" style="border-color: transparent; background: transparent;"></div>
          </div>
        </div>
      </div>

      <!-- Day Detail Modal -->
      <div
        class="modal-overlay"
        v-if="showDayModal"
        @click.self="showDayModal = false"
      >
        <div class="church-card modal-card modal-card-md animate-fade-in-up">
          <div class="modal-header-custom">
            <div class="d-flex align-items-center gap-3">
              <div
                class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style="width: 44px; height: 44px; background: linear-gradient(135deg, var(--gold-light) 0%, var(--cream) 100%);"
              >
                <i class="bi bi-calendar-day" style="color: var(--burgundy); font-size: 1.25rem;"></i>
              </div>
              <div>
                <h5 class="mb-0" style="color: var(--burgundy); font-family: var(--font-heading);">
                  {{ formatDateDisplay(selectedDateFull) }}
                </h5>
                <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">
                  {{ dayEvents.length }} event{{ dayEvents.length !== 1 ? 's' : '' }}
                </p>
              </div>
            </div>
            <button class="modal-close-btn" @click="showDayModal = false" type="button" aria-label="Close">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="p-4">
            <div v-if="dayEvents.length === 0" class="text-center py-4">
              <i class="bi bi-calendar2-plus fs-1" style="color: var(--gold); opacity: 0.3;"></i>
              <p class="mt-2 mb-3" style="color: var(--dark-light);">No events on this day</p>
              <button
                v-if="userStore.isManager"
                class="btn btn-church-primary"
                @click="addEventOnSelectedDay"
              >
                <i class="bi bi-plus-circle me-2"></i>Add Event
              </button>
            </div>

            <div v-else class="d-flex flex-column gap-3">
              <div
                v-for="ev in dayEvents"
                :key="ev.id"
                class="volunteer-card p-3"
              >
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <h6 class="mb-1" style="color: var(--burgundy);">{{ ev.name }}</h6>
                    <p class="mb-1" style="font-size: 0.85rem;">
                      <i class="bi bi-clock me-1" style="color: var(--gold);"></i>{{ formatTime(ev.time) }}
                    </p>
                    <p v-if="ev.location" class="mb-1" style="font-size: 0.85rem;">
                      <i class="bi bi-geo-alt me-1" style="color: var(--gold);"></i>{{ ev.location }}
                    </p>
                    <p v-if="ev.pastor" class="mb-1" style="font-size: 0.85rem;">
                      <i class="bi bi-person-badge me-1" style="color: var(--gold);"></i>{{ ev.pastor }}
                    </p>
                    <template v-if="ev.volunteers">
                      <p v-for="(names, pos) in ev.volunteers" :key="pos" v-if="names && names.length" class="mb-1" style="font-size: 0.85rem;">
                        <i :class="posIcon(pos)" class="me-1" style="color: var(--gold);"></i>
                        <strong>{{ pos }}:</strong> {{ names.join(', ') }}
                      </p>
                    </template>
                    <p v-else-if="ev.volunteerNames && ev.volunteerNames.length" class="mb-1" style="font-size: 0.85rem;">
                      <i class="bi bi-people me-1" style="color: var(--gold);"></i>
                      {{ ev.volunteerNames.join(', ') }}
                    </p>
                    <p v-if="ev.notes" class="mb-0 text-muted mt-1" style="font-size: 0.8rem; font-style: italic;">
                      <i class="bi bi-chat-quote me-1"></i>{{ ev.notes }}
                    </p>
                  </div>
                  <div v-if="userStore.isManager" class="d-flex gap-1 ms-3 flex-shrink-0">
                    <button class="btn btn-church-ghost btn-sm py-1" @click="editEventFromDay(ev)" title="Edit">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-church-ghost btn-sm py-1" style="color: var(--burgundy);" @click="openDeleteModal(ev)" title="Delete">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="userStore.isManager" class="text-center pt-2">
                <button class="btn btn-church-primary" @click="addEventOnSelectedDay">
                  <i class="bi bi-plus-circle me-2"></i>Add Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Events List -->
      <div class="animate-fade-in-up">
        <div class="church-card">
          <div class="church-card-header d-flex align-items-center justify-content-between">
            <span><i class="bi bi-list-check me-2"></i>Upcoming Events</span>
          </div>
          <div class="card-body">
            <div v-if="sortedUpcoming.length === 0" class="text-center py-4" style="color: var(--dark-light);">
              <i class="bi bi-calendar2-week fs-2" style="color: var(--gold); opacity: 0.4;"></i>
              <p class="mt-2 mb-0">No upcoming events scheduled</p>
            </div>
            <div v-else class="row g-3">
              <div class="col-md-6" v-for="ev in sortedUpcoming" :key="ev.id">
                <div class="volunteer-card h-100 position-relative cursor-pointer" @click="openDetailModal(ev)">
                  <div class="d-flex gap-3">
                    <div class="text-center flex-shrink-0">
                      <div
                        class="rounded-3 d-flex flex-column align-items-center justify-content-center px-3 py-2"
                        style="background: linear-gradient(135deg, var(--gold-light) 0%, var(--cream) 100%);"
                      >
                        <span class="fw-bold" style="color: var(--burgundy); font-size: 1.25rem; font-family: var(--font-heading); line-height: 1;">
                          {{ getDayNumber(ev.date) }}
                        </span>
                        <span style="color: var(--burgundy); font-size: 0.65rem; font-weight: 600; text-transform: uppercase;">
                          {{ getMonthAbbr(ev.date) }}
                        </span>
                      </div>
                    </div>
                    <div class="flex-grow-1 min-width-0">
                      <h6 class="mb-2" style="color: var(--burgundy);">{{ ev.name }}</h6>
                      <p class="mb-1" style="font-size: 0.85rem;">
                        <i class="bi bi-clock me-1" style="color: var(--gold);"></i>{{ formatTime(ev.time) }}
                      </p>
                      <p class="mb-1" style="font-size: 0.85rem;">
                        <i class="bi bi-geo-alt me-1" style="color: var(--gold);"></i>{{ ev.location || "—" }}
                      </p>
                      <p v-if="ev.pastor" class="mb-1" style="font-size: 0.85rem;">
                        <i class="bi bi-person-badge me-1" style="color: var(--gold);"></i>{{ ev.pastor }}
                      </p>
                      <template v-if="ev.volunteers">
                        <p v-for="(names, pos) in ev.volunteers" :key="pos" v-if="names && names.length" class="mb-1" style="font-size: 0.85rem;">
                          <i :class="posIcon(pos)" class="me-1" style="color: var(--gold);"></i>
                          <strong>{{ pos }}:</strong> {{ names.join(', ') }}
                        </p>
                      </template>
                      <p v-else-if="ev.volunteerNames && ev.volunteerNames.length" class="mb-1" style="font-size: 0.85rem;">
                        <i class="bi bi-people me-1" style="color: var(--gold);"></i>
                        <span v-for="(vn, vi) in ev.volunteerNames" :key="vn">
                          {{ vn }}<span v-if="vi < ev.volunteerNames.length - 1">, </span>
                        </span>
                      </p>
                      <p v-if="ev.notes" class="mb-0 text-muted" style="font-size: 0.8rem; font-style: italic;">
                        {{ ev.notes }}
                      </p>
                    </div>
                  </div>
                  <div v-if="userStore.isManager" class="d-flex gap-1 mt-2 justify-content-end">
                    <button class="btn btn-church-ghost btn-sm py-0" @click.stop="openEditModal(ev)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-church-ghost btn-sm py-0" style="color: var(--burgundy);" @click.stop="openDeleteModal(ev)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Create / Edit Event Modal -->
    <div
      class="modal-overlay"
      v-if="showModal"
      @click.self="closeModal"
    >
      <div class="church-card modal-card animate-fade-in-up">
        <div class="modal-header-custom">
          <div class="d-flex align-items-center gap-3">
            <div
              class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              style="width: 44px; height: 44px; background: linear-gradient(135deg, var(--gold-light) 0%, var(--cream) 100%);"
            >
              <i
                :class="editing ? 'bi bi-pencil-square' : 'bi bi-calendar-plus'"
                style="color: var(--burgundy); font-size: 1.25rem;"
              ></i>
            </div>
            <div>
              <h5 class="mb-0" style="color: var(--burgundy); font-family: var(--font-heading);">
                {{ editing ? 'Edit Event' : 'Add Event' }}
              </h5>
              <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">
                {{ editing ? 'Update the event details below' : 'Fill in the details to create a new event' }}
              </p>
            </div>
          </div>
          <button class="modal-close-btn" @click="closeModal" type="button" aria-label="Close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="p-4 p-lg-5">
          <div
            v-if="formError"
            class="alert d-flex align-items-center gap-2 mb-4 py-2 px-3"
            style="background: rgba(114, 47, 55, 0.08); border: 1px solid rgba(114, 47, 55, 0.2); color: var(--burgundy); border-radius: var(--radius-sm); font-size: 0.9rem;"
          >
            <i class="bi bi-exclamation-circle"></i>
            {{ formError }}
          </div>

          <form @submit.prevent="handleSave">
            <div class="mb-3">
              <label class="form-label d-flex align-items-center gap-2">
                <i class="bi bi-megaphone" style="color: var(--gold);"></i>Event Name
              </label>
              <input type="text" class="form-control" v-model="form.name" placeholder="e.g. Sunday Service" required />
            </div>

            <div class="row g-3 mb-3">
              <div class="col-sm-6">
                <label class="form-label d-flex align-items-center gap-2">
                  <i class="bi bi-calendar" style="color: var(--gold);"></i>Date
                </label>
                <input type="date" class="form-control" v-model="form.date" required />
              </div>
              <div class="col-sm-6">
                <label class="form-label d-flex align-items-center gap-2">
                  <i class="bi bi-clock" style="color: var(--gold);"></i>Time
                </label>
                <input type="time" class="form-control" v-model="form.time" required />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label d-flex align-items-center gap-2">
                <i class="bi bi-geo-alt" style="color: var(--gold);"></i>Location
              </label>
              <input type="text" class="form-control" v-model="form.location" placeholder="e.g. Main Sanctuary" />
            </div>

            <div class="mb-3">
              <label class="form-label d-flex align-items-center gap-2">
                <i class="bi bi-person-badge" style="color: var(--gold);"></i>Pastor
              </label>
              <input type="text" class="form-control" v-model="form.pastor" placeholder="e.g. Rev. Dr. Michael Anderson" />
            </div>

            <!-- Volunteers by Position -->
            <div class="mb-4">
              <label class="form-label d-flex align-items-center gap-2 mb-0">
                <i class="bi bi-people" style="color: var(--gold);"></i>Volunteers
              </label>
              <p class="mb-3" style="font-size: 0.8rem; color: var(--dark-light);">
                Assign volunteers for each ministry position
              </p>

              <div v-if="volStore.volunteers.length === 0" style="font-size: 0.85rem; color: var(--dark-light); padding: 1rem 0;">
                No volunteers found. Please <router-link to="/volunteers" style="color: var(--gold-dark);">add volunteers</router-link> first.
              </div>

              <template v-else>
                <!-- Mandatory positions -->
                <div
                  v-for="pos in mandatoryPositions"
                  :key="pos"
                  class="vol-position-group"
                >
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <i :class="posIcon(pos)" style="color: var(--gold);"></i>
                    <strong style="color: var(--burgundy); font-size: 0.9rem;">{{ pos }}</strong>
                    <span class="text-danger" style="font-size: 0.75rem;">required</span>
                  </div>
                  <div
                    v-if="getVolunteersByPosition(pos).length === 0"
                    style="font-size: 0.8rem; color: var(--dark-light); padding: 0.5rem 0;"
                  >
                    No volunteers with {{ pos }} position
                  </div>
                  <div v-else class="d-flex flex-wrap gap-2 mb-3">
                    <label
                      v-for="v in getVolunteersByPosition(pos)"
                      :key="v.id"
                      class="d-flex align-items-center gap-2 px-3 py-2 rounded-3 cursor-pointer volunteer-chip"
                      :class="form.volunteers[pos]?.includes(v.name) ? 'volunteer-chip-checked' : 'volunteer-chip-unchecked'"
                    >
                      <input
                        type="checkbox"
                        :value="v.name"
                        :checked="form.volunteers[pos]?.includes(v.name)"
                        @change="toggleVolunteer(pos, v.name)"
                        class="position-input"
                      />
                      <div class="avatar-circle avatar-circle-sm" style="width: 28px; height: 28px; font-size: 0.65rem;">
                        {{ getInitials(v.name) }}
                      </div>
                      <span style="font-size: 0.85rem;">{{ v.name }}</span>
                    </label>
                  </div>
                </div>

                <!-- Streaming toggle -->
                <div class="vol-position-group">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <i class="bi bi-broadcast" style="color: var(--gold);"></i>
                    <strong style="color: var(--burgundy); font-size: 0.9rem;">Streaming</strong>
                    <button
                      type="button"
                      class="btn btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-1"
                      :class="hasStreaming ? 'btn-church-primary' : 'btn-church-outline'"
                      @click="toggleStreaming"
                      style="font-size: 0.75rem; text-transform: none; letter-spacing: normal;"
                    >
                      <i :class="hasStreaming ? 'bi bi-check-circle-fill' : 'bi bi-circle'"></i>
                      {{ hasStreaming ? 'Enabled' : 'Disabled' }}
                    </button>
                  </div>

                  <Transition name="slide-fade">
                    <div v-if="hasStreaming" key="streaming-vols">
                      <div
                        v-if="getVolunteersByPosition('Streaming').length === 0"
                        style="font-size: 0.8rem; color: var(--dark-light); padding: 0.5rem 0;"
                      >
                        No volunteers with Streaming position
                      </div>
                      <div v-else class="d-flex flex-wrap gap-2">
                        <label
                          v-for="v in getVolunteersByPosition('Streaming')"
                          :key="v.id"
                          class="d-flex align-items-center gap-2 px-3 py-2 rounded-3 cursor-pointer volunteer-chip"
                          :class="form.volunteers['Streaming']?.includes(v.name) ? 'volunteer-chip-checked' : 'volunteer-chip-unchecked'"
                        >
                          <input
                            type="checkbox"
                            :value="v.name"
                            :checked="form.volunteers['Streaming']?.includes(v.name)"
                            @change="toggleVolunteer('Streaming', v.name)"
                            class="position-input"
                          />
                          <div class="avatar-circle avatar-circle-sm" style="width: 28px; height: 28px; font-size: 0.65rem;">
                            {{ getInitials(v.name) }}
                          </div>
                          <span style="font-size: 0.85rem;">{{ v.name }}</span>
                        </label>
                      </div>
                    </div>
                  </Transition>
                </div>
              </template>
            </div>

            <div class="mb-4">
              <label class="form-label d-flex align-items-center gap-2">
                <i class="bi bi-journal-text" style="color: var(--gold);"></i>Notes
              </label>
              <textarea
                class="form-control"
                v-model="form.notes"
                rows="3"
                placeholder="Additional notes or instructions..."
              ></textarea>
            </div>

            <div class="d-flex gap-2 pt-2">
              <button type="submit" class="btn btn-church-primary flex-fill" :disabled="saving">
                <span v-if="saving">
                  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving...
                </span>
                <span v-else>
                  <i :class="editing ? 'bi bi-check-lg' : 'bi bi-calendar-plus'" class="me-2"></i>
                  {{ editing ? 'Save Changes' : 'Create Event' }}
                </span>
              </button>
              <button type="button" class="btn btn-church-outline" @click="closeModal">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      class="modal-overlay"
      v-if="showDeleteModal"
      @click.self="showDeleteModal = false"
    >
      <div class="church-card modal-card modal-card-sm animate-fade-in-up">
        <div class="card-body p-4 text-center">
          <div
            class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style="width: 56px; height: 56px; background: rgba(114, 47, 55, 0.08); color: var(--burgundy); font-size: 1.5rem;"
          >
            <i class="bi bi-exclamation-triangle"></i>
          </div>
          <h5 class="mb-2" style="color: var(--burgundy); font-family: var(--font-heading);">
            Delete Event
          </h5>
          <p class="mb-4" style="color: var(--dark-light);">
            Are you sure you want to delete <strong>{{ deleteTarget?.name }}</strong>?
          </p>
          <div class="d-flex gap-2 justify-content-center">
            <button class="btn btn-church-primary" :disabled="saving" @click="handleDelete">
              <span v-if="saving">
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Deleting...
              </span>
              <span v-else>
                <i class="bi bi-trash me-2"></i>Delete
              </span>
            </button>
            <button class="btn btn-church-outline" @click="showDeleteModal = false">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Event Detail Modal -->
  <div
    class="modal-overlay"
    v-if="showDetailModal"
    @click.self="closeDetailModal"
  >
    <div class="church-card modal-card animate-fade-in-up">
      <div class="modal-header-custom">
        <div class="d-flex align-items-center gap-3">
          <div
            class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style="width: 44px; height: 44px; background: linear-gradient(135deg, var(--gold-light) 0%, var(--cream) 100%);"
          >
            <i class="bi bi-calendar-event" style="color: var(--burgundy); font-size: 1.25rem;"></i>
          </div>
          <div>
            <h5 class="mb-0" style="color: var(--burgundy); font-family: var(--font-heading);">
              {{ detailEvent?.name }}
            </h5>
            <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">Event Details</p>
          </div>
        </div>
        <button class="modal-close-btn" @click="closeDetailModal" type="button" aria-label="Close">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="p-4">
        <div class="d-flex flex-column gap-3">

          <!-- Date -->
          <div class="d-flex align-items-center gap-3">
            <div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style="width: 36px; height: 36px; background: rgba(201, 168, 76, 0.12);">
              <i class="bi bi-calendar3" style="color: var(--gold); font-size: 0.9rem;"></i>
            </div>
            <div>
              <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">Date</p>
              <p class="mb-0 fw-medium" style="color: var(--burgundy);">{{ formatDateDisplay(detailEvent?.date) }}</p>
            </div>
          </div>

          <!-- Time -->
          <div class="d-flex align-items-center gap-3">
            <div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style="width: 36px; height: 36px; background: rgba(201, 168, 76, 0.12);">
              <i class="bi bi-clock" style="color: var(--gold); font-size: 0.9rem;"></i>
            </div>
            <div>
              <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">Time</p>
              <p class="mb-0 fw-medium" style="color: var(--burgundy);">{{ formatTime(detailEvent?.time) }}</p>
            </div>
          </div>

          <!-- Location -->
          <div v-if="detailEvent?.location" class="d-flex align-items-center gap-3">
            <div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style="width: 36px; height: 36px; background: rgba(201, 168, 76, 0.12);">
              <i class="bi bi-geo-alt" style="color: var(--gold); font-size: 0.9rem;"></i>
            </div>
            <div>
              <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">Location</p>
              <p class="mb-0 fw-medium" style="color: var(--burgundy);">{{ detailEvent.location }}</p>
            </div>
          </div>

          <!-- Pastor -->
          <div v-if="detailEvent?.pastor" class="d-flex align-items-center gap-3">
            <div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style="width: 36px; height: 36px; background: rgba(201, 168, 76, 0.12);">
              <i class="bi bi-person-badge" style="color: var(--gold); font-size: 0.9rem;"></i>
            </div>
            <div>
              <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">Pastor</p>
              <p class="mb-0 fw-medium" style="color: var(--burgundy);">{{ detailEvent.pastor }}</p>
            </div>
          </div>

          <!-- Volunteers by position -->
          <template v-if="detailEvent?.volunteers">
            <div v-for="(names, pos) in detailEvent.volunteers" :key="pos" v-if="names && names.length" class="d-flex align-items-center gap-3">
              <div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style="width: 36px; height: 36px; background: rgba(201, 168, 76, 0.12);">
                <i :class="posIcon(pos)" style="color: var(--gold); font-size: 0.9rem;"></i>
              </div>
              <div>
                <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">{{ pos }}</p>
                <p class="mb-0 fw-medium" style="color: var(--burgundy);">{{ names.join(', ') }}</p>
              </div>
            </div>
          </template>
          <div v-else-if="detailEvent?.volunteerNames && detailEvent.volunteerNames.length" class="d-flex align-items-center gap-3">
            <div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style="width: 36px; height: 36px; background: rgba(201, 168, 76, 0.12);">
              <i class="bi bi-people" style="color: var(--gold); font-size: 0.9rem;"></i>
            </div>
            <div>
              <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">Volunteers</p>
              <p class="mb-0 fw-medium" style="color: var(--burgundy);">{{ detailEvent.volunteerNames.join(', ') }}</p>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="detailEvent?.notes" class="d-flex gap-3">
            <div class="d-flex align-items-start justify-content-center rounded-circle flex-shrink-0" style="width: 36px; height: 36px; background: rgba(201, 168, 76, 0.12);">
              <i class="bi bi-chat-quote" style="color: var(--gold); font-size: 0.9rem;"></i>
            </div>
            <div>
              <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">Notes</p>
              <p class="mb-0" style="color: var(--burgundy); font-style: italic;">{{ detailEvent.notes }}</p>
            </div>
          </div>

        </div>

        <!-- Manager actions -->
        <div v-if="userStore.isManager" class="d-flex gap-2 mt-4 pt-3 border-top" style="border-color: rgba(201, 168, 76, 0.2) !important;">
          <button class="btn btn-church-primary flex-fill" @click="editFromDetail">
            <i class="bi bi-pencil me-2"></i>Edit
          </button>
          <button class="btn btn-church-outline" style="color: var(--burgundy); border-color: rgba(114, 47, 55, 0.2);" @click="deleteFromDetail">
            <i class="bi bi-trash me-2"></i>Delete
          </button>
        </div>

        <div class="text-center mt-3">
          <button class="btn btn-church-outline" @click="closeDetailModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useUserStore } from "../stores/user";
import { useVolunteersStore } from "../stores/volunteers";
import { useEventsStore } from "../stores/events";

const userStore = useUserStore();
const volStore = useVolunteersStore();
const eStore = useEventsStore();

/* ---------- Calendar State ---------- */
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const currentDate = ref(new Date());
const currentMonth = ref(currentDate.value.getMonth());
const currentYear = ref(currentDate.value.getFullYear());

const currentMonthName = computed(() => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return months[currentMonth.value];
});

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
});

function currentMonthEvents(day) {
  if (!day) return [];
  const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return eStore.events.filter((ev) => ev.date === dateStr);
}

const sortedUpcoming = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eStore.events
    .filter((ev) => {
      if (!ev.date) return false;
      const d = new Date(ev.date + "T00:00:00");
      return d >= today;
    })
    .slice(0, 20);
});

function isToday(day) {
  if (!day) return false;
  const t = new Date();
  return day === t.getDate() && currentMonth.value === t.getMonth() && currentYear.value === t.getFullYear();
}

function getDayNumber(dateStr) {
  return new Date(dateStr + "T00:00:00").getDate();
}

function getMonthAbbr(dateStr) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[new Date(dateStr + "T00:00:00").getMonth()];
}

function formatTime(t) {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 || 12;
  return `${display}:${m} ${ampm}`;
}

function previousMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value--; }
  else { currentMonth.value--; }
  showDayModal.value = false;
}

function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++; }
  else { currentMonth.value++; }
  showDayModal.value = false;
}

/* ---------- Modal State ---------- */
const showModal = ref(false);
const showDeleteModal = ref(false);
const showDayModal = ref(false);
const selectedDay = ref(null);
const editing = ref(false);
const editingId = ref(null);
const saving = ref(false);
const deleteTarget = ref(null);
const formError = ref("");
const showDetailModal = ref(false);
const detailEvent = ref(null);

const selectedDateFull = computed(() => {
  if (selectedDay.value === null) return "";
  return `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, "0")}-${String(selectedDay.value).padStart(2, "0")}`;
});

const dayEvents = computed(() => {
  if (!selectedDateFull.value) return [];
  return eStore.events.filter((ev) => ev.date === selectedDateFull.value);
});

function openDayModal(day) {
  selectedDay.value = day;
  showDayModal.value = true;
}

function addEventOnSelectedDay() {
  showDayModal.value = false;
  editing.value = false;
  editingId.value = null;
  emptyForm();
  form.date = selectedDateFull.value;
  form.time = "09:00";
  showModal.value = true;
}

function editEventFromDay(ev) {
  showDayModal.value = false;
  openEditModal(ev);
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

const mandatoryPositions = ["Soundman", "Multimedia", "Musician"];

const form = reactive({
  name: "",
  date: "",
  time: "",
  location: "",
  pastor: "",
  volunteers: {
    Soundman: [],
    Multimedia: [],
    Musician: [],
    Streaming: [],
  },
  notes: "",
});

const hasStreaming = ref(false);

function emptyForm() {
  form.name = "";
  form.date = "";
  form.time = "";
  form.location = "";
  form.pastor = "";
  form.volunteers = { Soundman: [], Multimedia: [], Musician: [], Streaming: [] };
  form.notes = "";
  hasStreaming.value = false;
}

function getVolunteersByPosition(pos) {
  return volStore.volunteers.filter((v) => {
    const positions = Array.isArray(v.positions) ? v.positions : [v.position].filter(Boolean);
    return positions.includes(pos);
  });
}

function toggleVolunteer(pos, name) {
  const arr = form.volunteers[pos];
  if (!arr) return;
  const idx = arr.indexOf(name);
  if (idx === -1) {
    arr.push(name);
  } else {
    arr.splice(idx, 1);
  }
}

function toggleStreaming() {
  hasStreaming.value = !hasStreaming.value;
  if (!hasStreaming.value) {
    form.volunteers.Streaming = [];
  }
}

function posIcon(pos) {
  const icons = {
    Soundman: "bi bi-speaker",
    Multimedia: "bi bi-display",
    Musician: "bi bi-music-note-beamed",
    Streaming: "bi bi-broadcast",
  };
  return icons[pos] || "bi bi-person";
}

function openCreateModal() {
  editing.value = false;
  editingId.value = null;
  emptyForm();
  form.date = new Date().toISOString().slice(0, 10);
  form.time = "09:00";
  showModal.value = true;
}

function openEditModal(ev) {
  editing.value = true;
  editingId.value = ev.id;
  form.name = ev.name || "";
  form.date = ev.date || "";
  form.time = ev.time || "";
  form.location = ev.location || "";
  form.pastor = ev.pastor || "";
  form.notes = ev.notes || "";

  // Populate volunteers from event data
  form.volunteers = { Soundman: [], Multimedia: [], Musician: [], Streaming: [] };
  hasStreaming.value = false;

  if (ev.volunteers && typeof ev.volunteers === "object") {
    for (const pos of mandatoryPositions) {
      if (ev.volunteers[pos] && Array.isArray(ev.volunteers[pos])) {
        form.volunteers[pos] = [...ev.volunteers[pos]];
      }
    }
    if (ev.volunteers.Streaming && Array.isArray(ev.volunteers.Streaming) && ev.volunteers.Streaming.length > 0) {
      form.volunteers.Streaming = [...ev.volunteers.Streaming];
      hasStreaming.value = true;
    }
  } else if (ev.volunteerNames && Array.isArray(ev.volunteerNames)) {
    // Legacy format: best-effort match names to positions
    for (const pos of mandatoryPositions) {
      form.volunteers[pos] = ev.volunteerNames.filter((name) =>
        getVolunteersByPosition(pos).some((v) => v.name === name)
      );
    }
  }
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function openDeleteModal(ev) {
  deleteTarget.value = ev;
  showDeleteModal.value = true;
}

function openDetailModal(ev) {
  detailEvent.value = ev;
  showDetailModal.value = true;
}

function closeDetailModal() {
  showDetailModal.value = false;
  detailEvent.value = null;
}

function editFromDetail() {
  const ev = detailEvent.value;
  if (!ev) return;
  closeDetailModal();
  openEditModal(ev);
}

function deleteFromDetail() {
  const ev = detailEvent.value;
  if (!ev) return;
  closeDetailModal();
  openDeleteModal(ev);
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase();
}

async function handleSave() {
  saving.value = true;
  formError.value = "";

  // Validate mandatory positions
  for (const pos of mandatoryPositions) {
    if (!form.volunteers[pos] || form.volunteers[pos].length === 0) {
      formError.value = `Please assign at least one volunteer for ${pos}.`;
      saving.value = false;
      return;
    }
  }
  if (hasStreaming.value && (!form.volunteers.Streaming || form.volunteers.Streaming.length === 0)) {
    formError.value = "Streaming is enabled — please assign at least one volunteer for Streaming.";
    saving.value = false;
    return;
  }

  // Build flat volunteerNames (backward compat) from all positions
  const allNames = new Set();
  for (const pos of [...mandatoryPositions, "Streaming"]) {
    if (form.volunteers[pos]) {
      form.volunteers[pos].forEach((n) => allNames.add(n));
    }
  }

  try {
    const data = {
      name: form.name.trim(),
      date: form.date,
      time: form.time,
      location: form.location.trim(),
      pastor: form.pastor.trim(),
      volunteers: { ...form.volunteers },
      volunteerNames: Array.from(allNames),
      notes: form.notes.trim(),
    };
    if (editing.value) {
      await eStore.updateEvent(editingId.value, data);
    } else {
      await eStore.createEvent(data);
    }
    await eStore.fetchEvents();
    closeModal();
  } catch (err) {
    formError.value = err.message || "Failed to save event.";
  } finally {
    saving.value = false;
  }
}

async function handleDelete() {
  if (!deleteTarget.value) return;
  saving.value = true;
  try {
    await eStore.deleteEvent(deleteTarget.value.id);
    await eStore.fetchEvents();
    showDeleteModal.value = false;
    deleteTarget.value = null;
  } catch (err) {
    formError.value = err.message || "Failed to delete event.";
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  volStore.fetchVolunteers();
  eStore.fetchEvents();
});
</script>

<style scoped>
.col-1-7 {
  width: calc(100% / 7);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 24, 16, 0.5);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-card {
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  border: 2px solid rgba(201, 168, 76, 0.25);
  scrollbar-width: thin;
}

.modal-card-sm {
  max-width: 400px;
}

.modal-card-md {
  max-width: 540px;
}

.modal-header-custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, rgba(245, 240, 232, 0.6) 0%, rgba(232, 220, 200, 0.3) 100%);
  border-bottom: 2px solid rgba(201, 168, 76, 0.2);
  border-radius: calc(var(--radius-md) - 1px) calc(var(--radius-md) - 1px) 0 0;
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(201, 168, 76, 0.25);
  border-radius: 50%;
  background: var(--white);
  color: var(--dark-light);
  font-size: 0.8rem;
  transition: all var(--transition);
  cursor: pointer;
}

.modal-close-btn:hover {
  border-color: var(--burgundy);
  color: var(--burgundy);
  transform: rotate(90deg);
}

/* Volunteer chips */
.volunteer-chip {
  border-radius: 50px;
  transition: all 0.25s var(--ease-smooth);
  position: relative;
}

.volunteer-chip .position-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.volunteer-chip-unchecked {
  background: var(--cream-light);
  border: 2px solid rgba(201, 168, 76, 0.15);
}

.volunteer-chip-unchecked:hover {
  border-color: rgba(201, 168, 76, 0.4);
  transform: translateY(-2px);
}

.volunteer-chip-checked {
  background: rgba(201, 168, 76, 0.12);
  border: 2px solid var(--gold);
}

.position-input {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(201, 168, 76, 0.4);
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: all var(--transition);
}

.position-input:checked {
  background: var(--gold);
  border-color: var(--gold);
}

.position-input:checked::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--burgundy-dark);
  font-size: 0.7rem;
  font-weight: 700;
}

.cursor-pointer {
  cursor: pointer;
}

/* Volunteer position groups */
.vol-position-group {
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border-radius: var(--radius-sm);
  background: rgba(245, 240, 232, 0.4);
  border: 1px solid rgba(201, 168, 76, 0.1);
}

/* Slide-fade transition */
.slide-fade-enter-active {
  transition: all 0.35s var(--ease-smooth);
}
.slide-fade-leave-active {
  transition: all 0.2s var(--ease-smooth);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 575.98px) {
  .modal-header-custom {
    padding: 1rem 1.1rem;
  }
}
</style>
