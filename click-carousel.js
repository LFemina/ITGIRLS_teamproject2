
function isset(obj)
{
	if((typeof obj == 'undefined') || (obj === null)  || (obj === ""))
	{
		return false;
	}
	else
	{
		return true;
	}
}

(function(jQuery) {

/******************plugin arrayShift**************
Description: Takes an index of an array, places it at
another index, and shifts the rest of the array into place

PARAMETERS:
index;       //The index being moved
newLocation; //The new index of index

Postcondition: jQuery object has been altered ****/

jQuery.fn.arrayShift = function(index, newLocation)
{
	//Copy all matched elements of the jQuery object to an array
	var tempArr = jQuery.makeArray(jQuery(this));	
	
	//Loop through arguments and convert strings into integers.
	for(var i=0; i<arguments.length; i++)
	{
		if(isNaN(arguments[i]))
		{
			if(arguments[i] == "first")
			{
				//The first index of the array
				arguments[i] = 0;
			}
			else if (arguments[i] == "last")
			{
				//The last index of the array
				arguments[i] = tempArr.length-1;
			}
		}
		else
		{
			arguments[i] = parseInt(arguments[i], 10);
		}
	}
	
	
	//Create a temporary copy of array[index]
	var tempVal = tempArr[index];
	
	if(index > newLocation)
	{
		
		//For every index starting from [index] until (but not including)
		//the index newLocation, Copy the value of the previous index to the 
		//current index
		for(i=index; i>newLocation; i--)
		{
			tempArr[i] = tempArr[i-1];
		}
		
		//Copy the stored value to the newLocation index
		tempArr[newLocation] = tempVal;
		
	}
	else if(index < newLocation)
	{
		//For every index starting from [index] up until (but not including)
		//[newLocation], copy the value of the next index into the current index.
		for(i=index; i<newLocation; i++)
		{
			tempArr[i] = tempArr[i+1];
		}
		
		//Copy the stored value to the newLocation index
		tempArr[newLocation] = tempVal;		
	}
	
	return jQuery(tempArr);
};

jQuery.fn.getIndexOf = function(array)
{
	//Assume value isn't found
	var index = false;
	
	//Define scope
	var value = jQuery(this);
	
	//Initiate index counter
	var i=0;
	jQuery(array).each(function()
	{
		if(jQuery(this).equalTo(jQuery(value)))
		{
			index = i;
		}
		
		//Increment index counter
		i++;
	});
	
	return index;
};

jQuery.fn.equalTo = function(object)
{
	isEqual = !jQuery(this).not( jQuery(object) ).length;
	return isEqual;
};

jQuery.fn.selectIndex = function(index)
{
	
};

jQuery.fn.fakeFloat = function(options, callback)
{
	
	var defaults = {
	direction: "left",
	margin: 0,
	offset: 0,
	speed: 0
	},
	settings = jQuery.extend(defaults, jQuery.fn.fakeFloat.defaults, options);  
		
	//Initialize counter
	var i=0;
	
	//Initialize element width
	var elemWidth = 0;
	
	jQuery(this).each(function()
	{
		elemWidth = jQuery(this).width();
		if(settings.direction == "left")
		{
			jQuery(this).animate({"left": ((settings.margin) + elemWidth)*i + (settings.offset) + 'px'}, settings.speed);
		}
		else
		{
				jQuery(this).animate({"right": ((settings.margin) + elemWidth)*i + (settings.offset) + 'px'}, settings.speed);
		}
		i++;
	});
	
	if(typeof callback == 'function')
	{
		setTimeout(function(){callback.call(this);}, settings.speed);
	}
	
	return this;
	
};

/******************Plug-in clickCarousel *****************
Description: Sets up a click-based slider that moves the
clicked element to the end of a row of elements. Also shifts
the elements in view.


PARAMETERS:
direction    //The direction the carousel will shift. Either "left" or "right"
margin       //The space between the shifting elements of the carousel
hideSpeed    //How long the shifting element takes to retract (in ms)
shiftSpeed   //How long the elements take to shift (in ms)
clicker      //The element that triggers the shifting of the slide when clicked
shifting     //The elements that are shifting
shiftOnly    //A boolean variable that deactivates the retract functions when set to true
left         //The element that shifts the carousel left
right        //The element that shifts the carousel right

*********************************************************/

jQuery.fn.clickCarousel = function(options)
{
	//Define scope
	var container = jQuery(this);
	
	//Initialize animation boolean flag
	if(typeof container.animating == 'undefined' ) 
	{
		container.animating = false;
	}
	
	//List default values
	var defaults = {
	direction: "left",
	margin: 0,
	hideSpeed: 500,
	shiftSpeed: 500,
	clicker: jQuery(this).children(),
	shifting: jQuery(this).children(),
	shiftOnly: false,
	left: jQuery("#carouselLeft"),
	right: jQuery("#carouselRight")
	},
	settings = jQuery.extend({}, defaults, options); 
	
	//Set fakeFloat defaults
	jQuery.fn.fakeFloat.defaults = 
	{
		margin: settings.margin,
		direction: settings.direction
	};
	
	jQuery(settings.shifting).fakeFloat();
		
	
	//Check to see if the click-trigger is the same as what's being shifted.
	//Must be checked in this scope since settings.shifting undergoes
	//Array manipulation, thus rendering the equality test illogical after the first run. 
	var shiftingIsClicker = jQuery(settings.clicker).equalTo(settings.shifting);
	
	//If the carousel is being used for shifting AND retraction effect
	if(settings.shiftOnly === false)
	{
		jQuery(settings.clicker).click(function()
		{		
			//Define Scope
			var clicked  = jQuery(this);
			
			//Initialize index of clicked 
			var index;
			
			//If shifting elements and the click-trigger elements are the same
			if(shiftingIsClicker)
			{
				index = jQuery(clicked).getIndexOf(settings.shifting);
			}

			else //The index must be put in the context of what's being shifted
			{
				index = jQuery(clicked).parentsUntil(settings.shifting).getIndexOf(settings.shifting);
				
				//Make sure settings.shifting is the container of what will be shifted...not the click-trigger
				clicked = settings.shifting[index];
			}
			
			//If the container is not animated
			if(container.animating === false)
			{			
				//The container is now animating.
				container.animating = true;
								
				//Hide the clicked element's target
				jQuery(clicked).slideUp(settings.hideSpeed, function() 
				{		
					//Take the clicked element's target and add it to the end of the array
					//Also shift the clicker in order to keep settings.shifting and settings.clicker consistent. 
					settings.shifting = settings.shifting.arrayShift(index, "last");
					 settings.clicker = settings.clicker.arrayShift(index, "last");
					
					//Move and Align the Elements
					jQuery(settings.shifting).fakeFloat({speed: settings.shiftSpeed});
					
					//Reveal the element on the other side
					jQuery(clicked).show(0, function()
					{
						//The container has finished animating
						container.animating = false;
					});					
				});			
			}
		});	
	}
		
		//Create new scroller object that will hold variables throughout this section.
		var scroller = {};
			
		//Copies the first elemement to the shiftingElement property and primes
		//The index and newLocation properties to be used later in the arrayShift.
		scroller.firstToLast = function()
		{
			//Copy the first element.
			scroller.shiftingElement = settings.shifting[0];
					
			//First index will be shifted to last index
			scroller.index = "first";
			scroller.newLocation = "last";
		
		};
		
		//Copies the last elemement to the shiftingElement property and primes
		//The index and newLocation properties to be used later in the arrayShift.			
		scroller.lastToFirst = function()
		{
			//Copy the last element.
			scroller.shiftingElement = settings.shifting[settings.shifting.length-1];
				
			//Last index will be shifted to first index
			scroller.index = "last";
			scroller.newLocation = "first";	
		
		};
		
		//Determines how the indexes should shift depending upon the direction of
		//The carousel and which way the carousel will shift
		scroller.getIndexes = function(shiftDirection)
		{
			if(shiftDirection === "left")
			{
				if(settings.direction === "left")
				{
					scroller.firstToLast();
				}
				else if(settings.direction === "right")
				{
					scroller.lastToFirst();		
				}
			}
			else if(shiftDirection === "right")
			{
				if(settings.direction === "left")
				{
					scroller.lastToFirst();		
				}
				else if(settings.direction === "right")
				{
					scroller.firstToLast();
				}			
			}
		};
		
		//Executes the carousel scroll animation
		scroller.scroll = function()
		{
			//The container is now animating.
			container.animating = true;
								
			//Hide the shifting element
			jQuery(scroller.shiftingElement).hide();	
			
			//Shift the Array
			settings.shifting = settings.shifting.arrayShift(scroller.index, scroller.newLocation);
			
			//Readjust elements visually
			jQuery(settings.shifting).fakeFloat({speed: settings.shiftSpeed},function()
			{			
				//Show the shifting element 
				jQuery(scroller.shiftingElement).show();
				
				//The container has finished animating
				container.animating = false;
			});				
		};
		 
		/*********************************************************/
		/** End scroll method definitions, begin code execution **/
		/*********************************************************/
		
			//If the left property is defined
			if(isset(settings.left))
			{
				//When the left property is clicked
				jQuery(settings.left).click(function()
				{				
					//If the container is NOT animating, allow the following code to execute
					if(container.animating === false)
					{
						//Determine how the array indexes should shift
						scroller.getIndexes("left");
						
						//Execute the scrolling animation
						scroller.scroll();			
					}
				});				
			}	

			//If the right property is defined
			if(isset(settings.right))
			{
				//When the right property is clicked
				jQuery(settings.right).click(function()
				{				
					//If the container is NOT animating, allow the following code to execute
					if(container.animating === false)
					{
						//Determine how the array indexes should shift
						scroller.getIndexes("right");
						
						//Execute the scrolling animation
						scroller.scroll();			
					}
				});				
			}			
			
};

jQuery.fn.frontpush = function(array)
{
	//Number of elements in the jQuery object
	var numElements = jQuery(this).length;
	
	//Convert matched elements to an array for processing.
	var thisArray = jQuery.makeArray(jQuery(this));
	
	//For the number of elements in the jQuery object
	for(var i=0; i<numElements; i++)
	{
		//Prime an array at the end
		array.push("");
	}
		
	//For each original element of the array, go backwards and copy	
	for(i=(array.length); i>numElements; i--)
	{	
		var j=i-1; //Account for array.length and array[index] discrepancy
		array[j] = array[j-numElements];
	}
	
	//Plug in the new values into the front of the array
	for(i=0; i<numElements; i++)
	{	
		array[i] = thisArray[i];
	}
	
	return jQuery(array);
};

})(jQuery); //End document