#### {{passFail}}


----
**Tallies:**
:+1:: {{yea}} ({{yeaPercent}}%)
:-1:: {{nay}} ({{nayPercent}}%)

{{#nonStarGazers}}
    {{#first}}
These following {{nonStarGazers.length}} voter(s) were not stargazers, so their votes were not counted:
    {{/first}}

- :monkey: @{{name}}

    {{#last}}
Be sure to :star:star the repository if you want to have your say!
    {{/last}}
{{/nonStarGazers}}
