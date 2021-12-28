function ScoredName (name, score)
{
    /**
     * Public
     */

    this.name = name;
    this.score = score;


    this.toString = function ()
    {
        return name + " score: " + score;
    }
}

ScoredName.comparator = function (p_a, p_b)
{
    if (p_a.score < p_b.score)
    {
        return 1;
    }
    else if (p_a.score > p_b.score)
    {
        return -1;
    }
    else
    {
        return p_a.name.localeCompare(p_b.name);
    }
}
