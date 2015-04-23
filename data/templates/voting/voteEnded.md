#### {{{passFail}}}


----
**Tallies:**
:+1:: {{yea}} ({{yeaPercent}}%)
:-1:: {{nay}} ({{nayPercent}}%)

{{#nonStarGazers}}
    {{#first}}
These following {{nonStarGazers.length}} voter(s) were not _stargazers_, so their votes were not counted:
    {{/first}}

- :monkey: @{{name}}

    {{#last}}
*Non-stargazers*: Be sure to :star:star the repository if you want to have your say!
    {{/last}}
{{/nonStarGazers}}
