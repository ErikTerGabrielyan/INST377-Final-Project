$(document).ready(function() {
  $('form').submit(function(event) {
    // Prevent the form from submitting normally
    event.preventDefault();
    
    // Get the selected search type and search query
    var searchType = $('#search-type').val();
    var searchQuery = $('#search-input').val();
    searchQuery = searchQuery.replace(" ", "%20");

    // Make a request to the PlanetTerp API
    if (searchType === "course"){
      var url = `https://api.planetterp.com/v1/${searchType}?name=${searchQuery}`;
    } else {
      var url = `https://api.planetterp.com/v1/${searchType}?name=${searchQuery}&reviews=true`;
    }
    console.log(url)
    $.get(url, function(data) {
      console.log(searchType)
      console.log(data)
      console.log(data.length)
      // Check if the request was successful
      if (data && searchType === "course") {
          // Get the first course in the response
          var course = data;

          // Get the course title and average GPA
          var title = course.title;
          var description = course.description;
          var credits = course.credits;
          var gpa = course.average_gpa;
          var professors = course.professors;
          gpa = Math.round(gpa * 100) / 100

          // Display the title and GPA in the results div
          $('#results').html(`Course Title: ${title}<br>Description: ${description}<br>Credits: ${credits}<br>Average GPA: ${gpa}<br>Professors: ${professors}`);
        } else if (data && searchType !== "course") {
          var professor = data;

          var name = professor.name;
          var courses = professor.courses;
          var averageRating = professor.average_rating;
          var reviews = professor.reviews;
          var reviewsString = '';
          
          if (reviews.length > 0) {
            for (var i = 0; i < reviews.length; i++) {
              var review = reviews[i];
              var rating = review.rating;
              var comment = review.comment;
              reviewsString += `<li>Rating: ${rating}</li>`;
            }
          } else {
            reviewsString = 'No reviews found.';
          }

          if (averageRating === null){
            averageRating = "Professor has not yet been rated"
          } else {
            averageRating = Math.round(averageRating * 100) / 100
          }
          
          $('#results').html(`Professor Name: ${name}<br>Courses Taught: ${courses}<br>Average Rating: ${averageRating}<br>${reviews.length} Reviews:<ul>${reviewsString}</ul>`);
      } else {
        // Request failed
        $('#results').html('An error occurred while fetching results.');
      }
    });
  });
});