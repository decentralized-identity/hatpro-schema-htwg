# PUML Rendering Flags

Rendering UML models for HATPro can be become very difficult to read if displaying all the HATPRo specific extension information (SCHEMAHINTs  - which provide JSON Schema generation hints) and human targeted explanation.

There are two flags, which must be included in all HATPro classes (including ENUM classes) to allow a developer (or anyone creating, updating or viewing) the entire HATPro model or a sub-section.

The two rendering flags are options for ignoring .puml notes which have these flags attached (examples, below):

- VIEW_MODE - allows .puml **notes** containing SCHEMAHINTS to be viewed/hidden on rendering
- HIDE_COMMENTS - allows flagging any specific .puml **notes** to be viewed/hidden on rendering

Whether these flags are used is dependent on settings in the file being rendered (e.g., TravelProfile.puml for the entire model or PhysicalLocation.puml for just the PhyscialLocation segment). 

- Important note, if the following flags are defined in contained/referenced .puml files, then those flags will be respected for that .puml file and those that IT contains 

Insert the flags close to the top of the .puml file you are viewing. Normally, these are commented out (e.g., with a tick(')). 

### Note on PUML NOTES

For these keywords to be active, a .puml note needs to be the following wrappers:

##### Hide/Show SCHEMAHINTS

!ifndef VIEW_MODE
*note right of* <classname>
SCHEMAHINTS v0.1
   <hints content>
*endnote*
!endif

##### Hide/Show any comment

!ifndef HIDE_COMMENTS
*note right of* <classname>
   <regular developer comments>
*endnote*
!endif

