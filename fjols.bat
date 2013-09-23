@echo off
cd "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup"

echo outputString = "Du min gode mann, er et stort FJOLS!" >> fjols.vbs
echo wscript.sleep 10000                                   >> fjols.vbs
echo set shl = createobject("wscript.shell")               >> fjols.vbs
echo retVal = shl.Run("notepad", 3, False)                 >> fjols.vbs
echo wscript.sleep 200                                     >> fjols.vbs  
echo For i=1 To Len(outputString)                          >> fjols.vbs  
echo     shl.sendkeys Mid(outputString,i,1)                >> fjols.vbs  
echo     wscript.sleep 200                                 >> fjols.vbs  
echo Next                                                  >> fjols.vbs  
                                               
del "%~f0%"                                    
