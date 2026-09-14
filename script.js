const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');

    menuButton.setAttribute(
      'aria-expanded',
      String(isOpen)
    );
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');

      menuButton.setAttribute(
        'aria-expanded',
        'false'
      );
    });
  });
}


const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}


/*
  Pages CMS connection
*/

function getElement(id) {
  return document.getElementById(id);
}


function setText(id, value) {
  const element = getElement(id);

  if (element && value !== undefined && value !== null) {
    element.textContent = value;
  }
}


function normalizePath(path) {
  if (!path) return '';

  /*
    This is important for GitHub Pages project websites.

    It converts:
    /assets/photo.jpg

    into:
    assets/photo.jpg
  */

  return String(path).replace(/^\/+/, '');
}


function setImage(id, path, altText = '') {
  const image = getElement(id);

  if (!image || !path) return;

  image.src = normalizePath(path);

  if (altText) {
    image.alt = altText;
  }
}


function setLink(id, url) {
  const link = getElement(id);

  if (link && url) {
    link.href = url;
  }
}


function phoneHref(phone) {
  if (!phone) return '#';

  let digits = phone.replace(/\D/g, '');

  if (digits.length === 10) {
    digits = `1${digits}`;
  }

  return `tel:+${digits}`;
}


function escapeHTML(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


async function loadSiteContent() {

  try {

    /*
      Date parameter prevents your browser from showing
      an old cached copy of site.json.
    */

    const response = await fetch(
      `content/site.json?v=${Date.now()}`,
      {
        cache: 'no-store'
      }
    );


    if (!response.ok) {
      throw new Error(
        `Unable to load site.json: ${response.status}`
      );
    }


    const data = await response.json();


    /*
      HERO
    */

    setText(
      'hero-name',
      data.hero?.name
    );

    setText(
      'hero-headline',
      data.hero?.headline
    );

    setText(
      'hero-description',
      data.hero?.description
    );

    setText(
      'hero-note',
      data.hero?.note
    );

    setText(
      'hero-location',
      data.hero?.location
    );

    setText(
      'hero-card-text',
      data.hero?.card_text
    );

    setImage(
      'hero-photo',
      data.hero?.photo,
      `${data.hero?.name || 'Rojja Kharel'}`
    );


    /*
      ABOUT
    */

    setText(
      'about-heading',
      data.about?.heading
    );

    setText(
      'about-text-1',
      data.about?.text_1
    );

    setText(
      'about-text-2',
      data.about?.text_2
    );


    const aboutSkills =
      getElement('about-skills');

    if (
      aboutSkills &&
      Array.isArray(data.about?.skills)
    ) {

      aboutSkills.innerHTML =
        data.about.skills
          .map(
            skill =>
              `<span>${escapeHTML(skill)}</span>`
          )
          .join('');
    }


    /*
      EXPERIENCE
    */

    setText(
      'experience-heading',
      data.experience?.heading
    );


    const featured =
      data.experience?.featured;

    if (featured) {

      setText(
        'featured-job-date',
        featured.date
      );

      setText(
        'featured-job-title',
        featured.title
      );

      setText(
        'featured-job-org',
        featured.organization
      );

      setText(
        'featured-job-description',
        featured.description
      );

      setImage(
        'featured-job-photo',
        featured.photo,
        featured.title
      );
    }


    const experienceList =
      getElement('experience-list');

    if (
      experienceList &&
      Array.isArray(data.experience?.jobs)
    ) {

      experienceList.innerHTML =
        data.experience.jobs
          .map(
            job => `
              <article class="timeline-item">

                <p class="date">
                  ${escapeHTML(job.date)}
                </p>

                <h3>
                  ${escapeHTML(job.title)}
                </h3>

                <p class="org">
                  ${escapeHTML(job.organization)}
                </p>

                <p>
                  ${escapeHTML(job.description)}
                </p>

              </article>
            `
          )
          .join('');
    }


    /*
      LEADERSHIP
    */

    setText(
      'leadership-heading',
      data.leadership?.heading
    );

    setText(
      'leadership-text',
      data.leadership?.text
    );

    setImage(
      'leadership-photo',
      data.leadership?.photo,
      'Rojja Kharel leadership experience'
    );

    setLink(
      'leadership-link',
      data.leadership?.linkedin
    );


    /*
      RECOGNITION
    */

    setText(
      'recognition-heading',
      data.recognition?.heading
    );

    setText(
      'recognition-year',
      data.recognition?.year
    );

    setText(
      'recognition-title',
      data.recognition?.title
    );

    setText(
      'recognition-org',
      data.recognition?.organization
    );

    setText(
      'recognition-description-1',
      data.recognition?.description_1
    );

    setText(
      'recognition-description-2',
      data.recognition?.description_2
    );

    setImage(
      'recognition-photo',
      data.recognition?.photo,
      data.recognition?.title
    );

    setLink(
      'recognition-link',
      data.recognition?.linkedin
    );


    const recognitionTags =
      getElement('recognition-tags');

    if (
      recognitionTags &&
      Array.isArray(data.recognition?.tags)
    ) {

      recognitionTags.innerHTML =
        data.recognition.tags
          .map(
            tag =>
              `<span>${escapeHTML(tag)}</span>`
          )
          .join('');
    }


    /*
      EDUCATION
    */

    setText(
      'education-heading',
      data.education?.heading
    );


    const educationList =
      getElement('education-list');

    if (
      educationList &&
      Array.isArray(data.education?.items)
    ) {

      educationList.innerHTML =
        data.education.items
          .map(
            item => `
              <article class="card image-card">

                <img
                  src="${escapeHTML(
                    normalizePath(item.photo)
                  )}"
                  alt="${escapeHTML(item.title)}"
                  loading="lazy"
                >

                <div class="image-card-copy">

                  <p class="date">
                    ${escapeHTML(item.years)}
                  </p>

                  <h3>
                    ${escapeHTML(item.title)}
                  </h3>

                  ${
                    item.subtitle
                      ? `
                        <p class="org">
                          ${escapeHTML(item.subtitle)}
                        </p>
                      `
                      : ''
                  }

                  <p>
                    ${escapeHTML(item.description)}
                  </p>

                </div>

              </article>
            `
          )
          .join('');
    }


    /*
      BAKING / INSTAGRAM
    */

    setText(
      'bakes-name',
      data.bakes?.name
    );

    setText(
      'bakes-description',
      data.bakes?.description
    );

    setText(
      'bakes-quote',
      data.bakes?.quote
    );


    const instagram =
      getElement('bakes-instagram');

    if (instagram) {

      if (data.bakes?.instagram) {

        instagram.href =
          data.bakes.instagram;

        instagram.hidden = false;

      } else {

        instagram.hidden = true;

      }
    }


    /*
      CONTACT
    */

    setText(
      'contact-intro',
      data.contact?.intro
    );

    setText(
      'contact-email',
      data.contact?.email
    );

    setText(
      'contact-phone',
      data.contact?.phone
    );


    setLink(
      'hero-linkedin',
      data.contact?.linkedin
    );

    setLink(
      'contact-linkedin-link',
      data.contact?.linkedin
    );


    if (data.contact?.email) {

      setLink(
        'hero-email',
        `mailto:${data.contact.email}`
      );

      setText(
        'hero-email',
        data.contact.email
      );

      setLink(
        'contact-email-link',
        `mailto:${data.contact.email}`
      );
    }


    if (data.contact?.phone) {

      const telephone =
        phoneHref(data.contact.phone);

      setLink(
        'hero-phone',
        telephone
      );

      setText(
        'hero-phone',
        data.contact.phone
      );

      setLink(
        'contact-phone-link',
        telephone
      );
    }


    /*
      RESUME
    */

    if (data.contact?.resume) {

      const resumePath =
        normalizePath(
          data.contact.resume
        );

      setLink(
        'hero-resume',
        resumePath
      );

      setLink(
        'nav-resume',
        resumePath
      );

      setLink(
        'contact-resume-link',
        resumePath
      );
    }

  } catch (error) {

    console.error(
      'Website content could not be loaded:',
      error
    );
  }
}


loadSiteContent();
