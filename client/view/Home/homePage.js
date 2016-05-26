Template.homePage.events({
	'submit .new_event' : function(event,template){
		event.preventDefault();
		var newEvent = $('#event_name').val();
		var eventDesc = $('#event_desc').val();
		console.log("a");
		console.log(newEvent);
		var id;
		if(newEvent.length > 0){
			console.log("event found");
			if(eventDesc.length > 0){
				console.log("inner");
				var eventData = {
					eventName: newEvent,
		            eventDesc: eventDesc,
		            eventLikes: 0
		        }
				var newEventPosted = Events.insert(eventData,
		            function(error, result) {
		                if (error) {
		                    console.log("Error:" + error.reason);
		                    return;
		                }
		                else
		                {
		                	$("#event_name").val("");
		                	$("#event_desc").val("");
						}
						var id = result;
						console.log(id);
						FS.Utility.eachFile(event, function(file) {
					        Images.insert(file, id, function (err, fileObj) {
					        	console.log("heyy");
					          	if (err){
					             // handle error
					          	} else {
					             // handle success depending what you need to do
					             console.log('whatsupp');
					            	var imagesURL = {
					            		
					              		'eventImage': '/cfs/files/images/' + fileObj._id
					            };

					            	Events.update({_id: id}, {$set: imagesURL});
					          	}

					        });
				    	});
					});
				}
			}
		},
		'click .like_event' : function(){
			event.preventDefault();
			var id = event.target.id;
			console.log(event.target);
			console.log(id);
			var eachEvent = Events.find({_id: id}).fetch();
			var incrementLike = eachEvent[0].eventLikes + 1;
			var newLikes = {
				'eventLikes' : incrementLike
			}
			var newLikerEmail = Meteor.user().services.facebook.email;
			var findEmail = Events.find( { $and: [ {_id: id}, {newLikerEmail: newLikerEmail} ] }).fetch();
			console.log(findEmail);
			var newLiker = {
				'newLikerEmail': newLikerEmail
			}
			if(Meteor.user()){
				if(findEmail == ''){
					Events.update({_id: id}, {$set: newLikes});
					Events.update({_id: id}, {$push: newLiker});
				}
			}
		}

});

Template.homePage.helpers({
	eachEvent: function() {
        
        var eachEvent = Events.find().fetch();

        return eachEvent;
    }
})