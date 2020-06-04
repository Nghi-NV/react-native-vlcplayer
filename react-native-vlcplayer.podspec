Pod::Spec.new do |s|
  s.name         = "react-native-vlcplayer"
  s.version      = "1.0.0"
  s.summary      = "VLC player"
  s.requires_arc = true
  s.author       = { 'nghinv' => 'nghinv@lumibiz' }
  s.license      = 'MIT'
  s.homepage     = 'https://github.com/Nghi-NV/react-native-vlcplayer'
  s.source       = { :git => "https://github.com/Nghi-NV/react-native-vlcplayer.git" }
  s.source_files = 'ios/RCTVLCPlayer/*'
  s.platform     = :ios, "8.0"
  s.static_framework = true  
  s.dependency 'React'
  s.dependency 'MobileVLCKit', '3.3.10'
end
