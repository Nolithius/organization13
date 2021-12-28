var initializeStep;
var permuteStep;
var scoreStep;
var trimStep;
var outputStep;


$(function()
{
	var outputs = ["h1", "h2", "h3", "h4", "h5"];

	function output(p_scoredName, p_highestScore, p_lowestScore)
	{
        // Lerp
		var h = Math.round((1 - (p_scoredName.score - p_lowestScore) / (p_highestScore - p_lowestScore)) * 4) + 1;

		$("#output h" + h).append("<span title=\"" + p_scoredName + "\">" + p_scoredName.name + "</span>");
	}


    function trace(p_trace)
    {
        $("#output h1").html(p_trace ? "<span class=\"trace\">" + p_trace + "</span>" : "");
    }


    function error(p_error)
    {
        $("#output h1").append("<span class=\"error\">" + p_error + "</span>");
    }


    function sanitize(p_name)
    {
        if (p_name)
        {
            return p_name.replace(/([^A-Za-z])/g, '');
        }
        else
        {
            return undefined;
        }
    }


	var $_GET = {};

	document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function ()
	{
	    function decode (s)
	    {
	        return decodeURIComponent(s.split("+").join(" "));
	    }

	    $_GET[decode(arguments[1])] = decode(arguments[2]);
	});

	var name = sanitize($_GET["name"]);

    if (name)
    {
	   $("#name").val(name);
    

        if (name.length > 1 && name.length <= 9)
        {
            var scorer3;
            var scorer4;
            var scorer5;
            var scorer6;
            var permuter;
            var permutations;
            var scoredNames = [];
            var highestScore = -1;
            var lowestScore = Number.MAX_VALUE;
            var trimmedNames = [];


            initializeStep = function()
            {
                scorer3 = new Scorer(3, name);
                scorer4 = new Scorer(4, name);
                scorer5 = new Scorer(5, name);

                trace("Permuting...");
                setTimeout(permuteStep, 10);
            }


            permuteStep = function()
            {
            	permuter = new Permuter(name + "X");
            	permutations = permuter.permute();

                trace("Scoring...");
                setTimeout(scoreStep, 10);
            }


            scoreStep = function()
            {
                var nameX = (name + "X").toLowerCase();
                var xName = ("X" + name).toLowerCase();

            	for (var i = 0; i < permutations.length; i++)
                {
                	var permutation = permutations[i];
                    var lowerCasePermutation = permutation.toLowerCase();

                	// Ignore nameX and Xname
                    if (lowerCasePermutation != nameX && lowerCasePermutation != xName)
                    {
                    	var score = scorer3.score(permutation) + scorer4.score(permutation) + scorer5.score(permutation);

                        if (score > 0)
                        {
                            var scoredName = new ScoredName(permutation, score);

                            highestScore = Math.max(highestScore, score);

                            scoredNames.push(scoredName);
                        }
                    }
                }

                trace("Trimming...");
                setTimeout(trimStep, 10);
            }


            trimStep = function ()
            {
                var cutoff = 4;
                var previousCutoff = 0;

                while (trimmedNames.length < Math.min(30, scoredNames.length))
                {
                    for (var i = 0; i < scoredNames.length; i++)
                    {
                        var scoredName = scoredNames[i];

                        if (scoredName.score > highestScore - cutoff && scoredName.score <= highestScore - previousCutoff)
                        {   
                            trimmedNames.push(scoredName);

                            lowestScore = Math.min(lowestScore, scoredName.score);
                        }
                    }

                    previousCutoff = cutoff;
                    cutoff += 1;
                }

                trace("");
                setTimeout(outputStep, 10);
            }


            outputStep = function (index)
            {
                if (index === undefined)
                {
                    index = 0;
                }

                if (index > trimmedNames.length)
                {
                    return;
                }

                // Optional
                // trimmedNames.sort(ScoredName.comparator);

                for (var i = index; i < index + 1000 && i < trimmedNames.length; i++)
                {
                    output(trimmedNames[i], highestScore, lowestScore);
                }

                setTimeout("outputStep(" + (index + 1000) + ")", 20);
            }

            trace("Initializing...");
            setTimeout(initializeStep, 10); 
        }
        else
        {
            if (name.length < 2)
            {
                error("Minimum 2 letters.");
            }
            else if (name.length > 9)
            {
                error("Maximum 9 letters.");
            }
        }
    }
});