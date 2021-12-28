function Permuter (word)
{
    /**
     * Public
     */

    this.word = word;
    this.resultsBySize = {};

    this.addElement = function(element)
    {
        var set = this.resultsBySize[element.length];

        if (!set)
        {
            set = new Set();
            this.resultsBySize[element.length] = set;
        }

        set.add(element)
    }

    this.permute = function()
    {
        // var result = new Set();

        for (var i = 0; i < word.length; i++)
        {
            var letter = word.substr(i, 1);

            var newElements = [];

            // Optimization: Only add the first letter to the empty array
            if (i == 0)
            {
                this.addElement(letter.toLowerCase());
            }
            else
            {
                // Optimization: only operate on the largest elements
                var result = this.resultsBySize[i];

                for (let element of result)
                {
                    for (var k = 0; k <= element.length; k++)
                    {
                        var newElement = element.substr(0, k) + letter + element.substr(k);

                        if (i == word.length - 1)
                        {
                            this.addElement(capitalize(newElement));
                        }
                        else
                        {
                            this.addElement(newElement.toLowerCase());
                        }
                    }
                }
            }
        }

        return Array.from(this.resultsBySize[word.length].values());
    }
}
