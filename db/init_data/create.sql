DROP TABLE IF EXISTS search_history CASCADE;
CREATE TABLE IF NOT EXISTS search_history (
  show_name TEXT,       /* Name of tv show */
  img_link TEXT,   /* IMG URL  */
  rating DOUBLE PRECISION, /* Show Rating */
  show_summary TEXT, /* Summary of Show */
  genres TEXT [],
  link_to TEXT /* Link to show website */
);
