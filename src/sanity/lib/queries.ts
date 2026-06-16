import { defineQuery } from "next-sanity";
import { sanityFetch } from "./live";

export const getAuthorData = async () => {
  const AUTHOR_QUERY = defineQuery(`
    *[_type == "author"][0] {
      _id,
      name,
      initials,
      avatar {
        asset-> {
          url
        }
      },
      description,
      summary,
      location,
      skills,
      social {
        github,
        linkedin,
        twitter,
        youtube,
        email
      }
    }
  `);

  const author = await sanityFetch({
    query: AUTHOR_QUERY,
  });

  return author.data ?? null;
};

export const getWorkExperience = async () => {
  const WORK_QUERY = defineQuery(`
    *[_type == "workExperience"] | order(startDate desc) {
      _id,
      company,
      title,
      logo {
        asset-> {
          url
        }
      },
      location,
      startDate,
      endDate,
      description,
      url
    }
  `);

  const work = await sanityFetch({
    query: WORK_QUERY,
  });

  return work.data ?? [];
};

export const getEducation = async () => {
  const EDUCATION_QUERY = defineQuery(`
    *[_type == "education"] | order(startDate desc) {
      _id,
      school,
      degree,
      logo {
        asset-> {
          url
        }
      },
      startDate,
      endDate,
      url
    }
  `);

  const education = await sanityFetch({
    query: EDUCATION_QUERY,
  });

  return education.data ?? [];
};

export const getProjects = async () => {
  const PROJECTS_QUERY = defineQuery(`
    *[_type == "project"] | order(startDate desc) {
      _id,
      title,
      slug,
      description,
      startDate,
      endDate,
      technologies,
      image {
        asset-> {
          url
        }
      },
      video,
      links[] {
        title,
        url,
        type
      },
      featured
    }
  `);

  const projects = await sanityFetch({
    query: PROJECTS_QUERY,
  });

  return projects.data ?? [];
};

export const getProjectBySlug = async (slug: string) => {
  const PROJECT_BY_SLUG_QUERY = defineQuery(`
    *[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      longDescription,
      startDate,
      endDate,
      technologies,
      image {
        asset-> {
          url
        }
      },
      gallery[] {
        asset-> {
          url
        }
      },
      video,
      demoUrl,
      links[] {
        title,
        url,
        type
      },
      featured
    }
  `);

  const project = await sanityFetch({
    query: PROJECT_BY_SLUG_QUERY,
    params: { slug },
  });

  return project.data ?? null;
};

export const getArticles = async () => {
  const ARTICLES_QUERY = defineQuery(`
    *[_type == "article"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      coverImage {
        asset-> {
          url
        }
      },
      author-> {
        name
      },
      categories,
      publishedAt,
      featured
    }
  `);

  const articles = await sanityFetch({
    query: ARTICLES_QUERY,
  });

  return articles.data ?? [];
};

export const getFeaturedArticles = async () => {
  const FEATURED_ARTICLES_QUERY = defineQuery(`
    *[_type == "article" && featured == true] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      excerpt,
      coverImage {
        asset-> {
          url
        }
      },
      author-> {
        name
      },
      categories,
      publishedAt,
      featured
    }
  `);

  const articles = await sanityFetch({
    query: FEATURED_ARTICLES_QUERY,
  });

  return articles.data ?? [];
};

export const getArticleBySlug = async (slug: string) => {
  const ARTICLE_BY_SLUG_QUERY = defineQuery(`
    *[_type == "article" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      coverImage {
        asset-> {
          url
        }
      },
      content,
      author-> {
        name,
        avatar {
          asset-> {
            url
          }
        }
      },
      categories,
      publishedAt,
      featured
    }
  `);

  const article = await sanityFetch({
    query: ARTICLE_BY_SLUG_QUERY,
    params: { slug },
  });

  return article.data ?? null;
};
