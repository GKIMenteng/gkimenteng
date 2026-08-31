<template>
  <div>
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-building me-2"></i>About GKI Menteng
      </h1>
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="church-card p-4 p-lg-5 mb-4 animate-fade-in-up animate-stagger-1">
          <h3 class="section-title text-start mb-4" style="color: var(--burgundy)">Our Story</h3>
          <p class="fs-5 verse-text mb-3">
            "Being confident of this, that he who began a good work in you will carry it on to
            completion."
          </p>
          <span class="verse-ref d-block mb-4">— Philippians 1:6</span>
          <p>
            GKI Menteng Jakarta is known as one of the congregations of the Lord Jesus established
            in the heart of metropolitan Jakarta. The congregation became an independent church on
            December 5, 1965, having originated from GKI Kwitang Jakarta, with 30 professing
            members, 2 elders, and 2 deacons. Using the church building of Punguan Kristen Batak
            (PKB) Menteng, located at 96 HOS Cokroaminoto Street, Central Jakarta, the GKI Menteng
            congregation carried out its calling as the church of God. Meanwhile, Sunday School
            ministry for children was conducted at Besuki Elementary School (SD Besuki), located at
            4 Besuki Street, Jakarta.
          </p>
          <p class="mb-0">
            As the congregation grew, it eventually succeeded in constructing its own church
            building at 7 Latuharhary Street, Central Jakarta, which has been in use since October
            6, 1991. As of April 1, 1992, the congregation had 252 professing members and 101
            baptized members. As attendance at the Kelapa Gading Permai worship outpost continued to
            increase and its facilities proved adequate, its status was elevated to that of a Bajem
            (Mature Congregational Fellowship). On September 9, 2000, GKI Menteng formally
            established this Bajem as the independent congregation of GKI Kelapa Cengkir, Jakarta.
            The inauguration service was led by Rev. Daniel Susanto.
          </p>
        </div>

        <div class="church-card p-4 p-lg-5 mb-4 animate-fade-in-up animate-stagger-2">
          <h3 class="section-title text-start mb-4" style="color: var(--burgundy)">Our Mission</h3>
          <div
            class="p-4 rounded-3 mb-4 text-center"
            style="
              background: linear-gradient(
                135deg,
                rgba(201, 168, 76, 0.1) 0%,
                rgba(245, 240, 232, 0.5) 100%
              );
              border: 1px solid rgba(201, 168, 76, 0.2);
            "
          >
            <i class="bi bi-cross fs-1 mb-2" style="color: var(--gold)"></i>
            <p
              class="lead fs-4 mb-0"
              style="color: var(--burgundy); font-family: var(--font-heading)"
            >
              "To know Christ and to make Him known"
            </p>
          </div>
          <p class="mb-0">
            We exist to glorify God by making disciples who love God, love people, and serve the
            world. Our commitment is to create an environment where people can encounter God, grow
            in their faith, and discover their purpose.
          </p>
        </div>

        <div class="church-card p-4 p-lg-5 animate-fade-in-up animate-stagger-3">
          <h3 class="section-title text-start mb-4" style="color: var(--burgundy)">Our Values</h3>
          <div class="row g-4">
            <div class="col-sm-6" v-for="value in values" :key="value.title">
              <div class="d-flex gap-3">
                <div
                  class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style="
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, var(--gold-light) 0%, var(--cream) 100%);
                    color: var(--burgundy);
                    font-size: 1.15rem;
                  "
                >
                  <i :class="value.icon"></i>
                </div>
                <div>
                  <h5 class="mb-1" style="color: var(--burgundy); font-family: var(--font-heading)">
                    {{ value.title }}
                  </h5>
                  <p class="mb-0" style="font-size: 0.9rem">{{ value.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="church-card p-4 mb-4 animate-fade-in-up animate-stagger-4">
          <h5
            class="mb-3 d-flex align-items-center"
            style="color: var(--burgundy); font-family: var(--font-heading)"
          >
            <i class="bi bi-clock me-2" style="color: var(--gold)"></i>Service Times
          </h5>
          <div class="mb-3 pb-3" style="border-bottom: 1px solid rgba(201, 168, 76, 0.15)">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <strong>Sunday Morning</strong>
            </div>
            <p class="mb-0" style="font-size: 0.9rem; color: var(--dark-light)">
              9:00 AM — General Service
            </p>
          </div>
        </div>

        <div class="church-card p-4 mb-4 animate-fade-in-up animate-stagger-5">
          <h5
            class="mb-3 d-flex align-items-center"
            style="color: var(--burgundy); font-family: var(--font-heading)"
          >
            <i class="bi bi-geo-alt me-2" style="color: var(--gold)"></i>Contact Us
          </h5>
          <div class="mb-3" style="font-size: 0.9rem">
            <p class="mb-1">
              <i class="bi bi-geo-alt me-2" style="color: var(--gold)"></i>
              Jl. Latuharhary No.7, Jakarta
            </p>
            <p class="mb-1">
              <i class="bi bi-telephone me-2" style="color: var(--gold)"></i>
              (021) 3924182
            </p>
            <p class="mb-0">
              <i class="bi bi-envelope me-2" style="color: var(--gold)"></i>
              gkimenteng7@gmail.com
            </p>
          </div>
        </div>

        <div class="church-card p-4 animate-fade-in-up animate-stagger-6">
          <h5
            class="mb-3 d-flex align-items-center"
            style="color: var(--burgundy); font-family: var(--font-heading)"
          >
            <i class="bi bi-person-badge me-2" style="color: var(--gold)"></i>Leadership
          </h5>
          <div
            v-for="(leader, index) in leadership"
            :key="leader.name"
            class="py-3"
            :class="{ 'border-bottom': index < leadership.length - 1 }"
            style="border-color: rgba(201, 168, 76, 0.15) !important"
          >
            <strong style="color: var(--burgundy)">{{ leader.role }}</strong>
            <p class="mb-0" style="font-size: 0.9rem">{{ leader.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const values = [
  {
    title: "Love",
    description: "We believe in demonstrating God's unconditional love to all people.",
    icon: "bi bi-heart",
  },
  {
    title: "Truth",
    description: "We are committed to teaching and living by God's Word.",
    icon: "bi bi-book",
  },
  {
    title: "Community",
    description: "We foster genuine relationships and authentic fellowship.",
    icon: "bi bi-people",
  },
  {
    title: "Service",
    description: "We actively serve our local and global community.",
    icon: "bi bi-globe",
  },
];

const leadership = [
  { name: "Pdt. Em. Daniel Susanto", role: "Senior Pastor" },
  { name: "Pdt. Stella Luciana", role: "Associate Pastor" },
];
</script>
