# NewsCommenter

Mongo HW with Scraping, Saving and Commenting on News Articles.

### Our Site for gathering News is www.globalissues.org/news

## Expected Functionailty

The site scrapes Globalissues.org and provides back the latest article Headlines, Summaries, and a link to the full article.

Users can add Notes on a specific article which are stored in a seperate mongodb collection.

Users can "refresh" the list of articles. When a user refreshes the main Articles database is cleared of all unsaved articles before rescrapping the site and repopulating the Articles database.

## Problems along the way

The scrapping presented some issues, expecially at first when I thought I had it all figured out with the AP site, but was then blocked from scrapping any more. The good news is that it forced me to spend more time in the cheeriojs Docs, and I feel good about my ability with that module.

## Further Enhancement

Some features that I would have liked to implemnt, had I more time…

- I was able to do soem styling based on the "saved" of a particular article and would have liked to do more.
- I ran out time and was unable to implement an "unsave" button for the article.
- I ended up wrting code to scrape from multiple sites, and while only 1 was implemented for this project, I think I could easily expand the site to include multiple sources for the articles database.
