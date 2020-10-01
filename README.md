# spaceX-website

# Approach-
The SpaceX-Launch-program website shows data about all the different SpaceX launches, their successes and failures.
The initial page shows all the spacecrafts information which can then be filtered based on the provided filters. 
In my approach, once the initial information is available, on each filter selection, I check the correct filter combination, after giving a small window for the user to select all the required filters. After I have curated all the selected filters, the respective API is called. Once I receive the filtered data from the endpoint, the records are shown in the device specific layout. 

# Salient features -
1. **Media Queries**- for rendering the device specific layouts.
2. Used **Flexbox Layout** throughout for styling the components.
3. Used **Html5 features** like **semantic tags** and **srcset** for rendering images specific to the viewport.
4. **Debouncing** has been used to restrict the number of API calls triggered for each filter operation.
5. Used **ES6 features**.
6. **Loading Indicator** is shown until the records are fetched for the selected filter.

# Stack-
For the development of this website, I have used **JavaScript, jQuery, Html5 and SCSS/CSS**.
I have used **Webpack** and **Babel** for bundling and transpiling my code for ES5 compatibility.
I have used **Node package manager(NPM)** for installing various dependencies.

# Heroku link-
https://spacex-mission-program.herokuapp.com/

# Lighthouse Scores
Lighthouse score on my local server (With **100% Performance Score**):  

![alt text](https://github.com/surabhiaggrawal/SpaceX-website/blob/main/Lighthouse_local_server.PNG?raw=true)

Lighthouse score on Heroku (With **96% Performance Score**):

![alt text](https://github.com/surabhiaggrawal/SpaceX-website/blob/main/Lighthouse_heroku.PNG?raw=true)
